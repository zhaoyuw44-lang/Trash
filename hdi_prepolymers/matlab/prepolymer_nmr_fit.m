function R = prepolymer_nmr_fit(dataFile, varargin)
%PREPOLYMER_NMR_FIT  1H NMR area analysis of HDI-capped ethoxylated polyol prepolymers.
%
%   R = prepolymer_nmr_fit('spectrum.csv')            % glycerol ethoxylate (3-arm) default
%   R = prepolymer_nmr_fit('spectrum.xlsx','Polyol','PE')  % pentaerythritol ethoxylate (4-arm)
%
%   Input file : .csv / .txt / .xlsx, column 1 = chemical shift (ppm), column 2 = intensity.
%                Header lines are allowed (non-numeric rows are dropped). Order of ppm does not matter.
%   Output     : <name>_nmr_results.xlsx (sheets Integrals, Fit, Derived, Spectrum) or, when
%                'OutFile' ends in .csv, four CSV files; plus two PNG figures.
%
%   What it does
%     1. polynomial baseline from signal-free windows
%     2. direct integration of every assigned region (a ... i, diagnostics)
%     3. peak fitting (deconvolution) with J-coupled pseudo-Voigt multiplets in three windows:
%          b (4.21 t) | e (3.29 t) + f (3.16 q) | g (1.61 quint) + H2O + h (1.50) + i (1.36) + hexane/grease
%        Areas are solved by non-negative least squares (lsqnonneg) for each trial set of
%        centres/widths (variable projection); centres/widths are optimised with fminsearch.
%        Only base MATLAB functions are used (no toolboxes).
%     4. normalisation: area of b = 2*f H (f = number of arms: 3 for GE, 4 for PE)
%     5. derived quantities (formulas below) + plots
%
%   Peak assignments (CDCl3, 400 MHz; HDI-urethane-capped PEG-type polyol)
%     a   4.70-5.00  br s    urethane N-H                            f H
%     b   4.21       t       -CH2-O-C(=O)NH-                         2f H   (normalisation reference)
%     c   3.50-3.80  m       -O-CH2-CH2-O- (incl. CH2 beta to urethane at 3.69)  4*EO - 2f H
%     d   GE: 3.45-3.62 m (inside c) glycerol CH + 2 CH2          5 H
%         PE: 3.42 s (resolved)      C(CH2O)4                        8 H
%     e   3.29       t       -CH2-N=C=O                              2f H   (+4 per free HDI)
%     f   3.16       q (td)  -NH-CH2-                                2f H   (+4 per HDI-urea-HDI)
%     g   1.61       quint   -CH2-CH2-NCO                            2f H   (often under H2O ~1.56-1.65)
%     h   1.50       quint   -NH-CH2-CH2-                            2f H
%     i   1.31-1.42  m       central -CH2-CH2- of HDI                4f H
%     diagnostics: urea NH 4.30-4.60, allophanate NH 8.0-9.5, hexane CH3 0.88, residual HOCH2 3.72
%
%   Formulas (I_x = normalised area, b set to 2f)
%     EO per molecule      EO   = (I_c(+d) - Hcore_in_c + I_b) / 4        Hcore_in_c = 5 (GE), 0 (PE)
%     EO per arm           n    = EO / f
%     polyol Mn            Mn_p = M_core + 44.053*EO                      M_core 92.09 (GE), 136.15 (PE)
%     prepolymer Mn        Mn   = Mn_p + 168.20*f
%     theoretical NCO      NCO% = 42.02*f / Mn * 100
%     free HDI / molecule  x    = (I_e - I_f) / 4      (upper bound; allophanate also raises e)
%     HDI-urea-HDI / mol.  y    = max(0, (I_f - I_b) / 4)
%     free HDI from fit    x_g  = (A_g - A_h) / 4       (only meaningful when g is fitted under H2O)
%     sample mass / mol    m    = Mn + 168.20*x + 310.4*y
%     wt% free HDI         = 168.20*x / m * 100 ;  wt% urea dimer = 310.4*y / m * 100
%     NCO expected by titration = 42.02*(f + 2x + 2y) / m * 100
%     hexane / molecule    = I(0.80-0.95) / 6 ;  H2O / molecule (in the tube) = A_H2O / 2
%     ideal ratios         a/b = 0.5, f/b = 1, e/f = 1, h/b = 1, i/b = 2
%
%   Name-value options (defaults)
%     'Polyol'          'GE' | 'PE'                       ('GE')
%     'NominalN'        EO per arm from the supplier       (6.87 for GE, 3.75 for PE)
%     'SF'              spectrometer frequency, MHz        (400)
%     'Eta'             Lorentzian fraction of pseudo-Voigt (0.8)
%     'BaselineOrder'   polynomial order                   (2)
%     'BaselineWindows' n-by-2 [lo hi] ppm                  (see code)
%     'NormBy'          'integral' | 'fit'  (source of b)  ('integral')
%     'OutFile'         output file name (.xlsx or .csv)   (<input>_nmr_results.xlsx)
%     'Plot'            true | false                       (true)
%
%   Example
%     R = prepolymer_nmr_fit('3arm_peg_hdi.csv','Polyol','GE','SF',400);
%     disp(R.derived)

% ---------------------------------------------------------------- options
p = inputParser;
p.addParameter('Polyol', 'GE');
p.addParameter('NominalN', []);
p.addParameter('SF', 400);
p.addParameter('Eta', 0.8);
p.addParameter('BaselineOrder', 2);
p.addParameter('BaselineWindows', [9.60 10.0; 6.00 6.80; 5.25 5.60; 2.45 2.75; 0.98 1.12; 0.30 0.70]);
p.addParameter('NormBy', 'integral');
p.addParameter('OutFile', '');
p.addParameter('Plot', true);
p.parse(varargin{:});
opt = p.Results;
opt.Polyol = upper(opt.Polyol);

C = constants(opt.Polyol);
if isempty(opt.NominalN), opt.NominalN = C.nominalN; end
[fdir, fname] = fileparts(dataFile);
if isempty(opt.OutFile), opt.OutFile = fullfile(fdir, [fname '_nmr_results.xlsx']); end

% ---------------------------------------------------------------- data
[x, y] = read_spectrum(dataFile);
[base, used] = fit_baseline(x, y, opt.BaselineWindows, opt.BaselineOrder);
yc = y - base;

% ---------------------------------------------------------------- 1) integration
regs = region_table(opt.Polyol);
raw = zeros(numel(regs), 1);
for k = 1:numel(regs)
    raw(k) = region_integral(x, yc, regs(k).lo, regs(k).hi, regs(k).localbl);
end
ib = find(strcmp({regs.label}, 'b'));

% ---------------------------------------------------------------- 2) peak fitting
W = fit_windows(opt.Polyol);
fits = {};
fitRows = {};
for w = 1:numel(W)
    m = x >= W(w).lo & x <= W(w).hi;
    if nnz(m) < 20, continue; end
    fr = fit_window(x(m), yc(m), W(w).comps, opt.SF, opt.Eta);
    fr.name = W(w).name;
    fits{end + 1} = fr; %#ok<AGROW>
    for k = 1:numel(fr.res)
        fitRows(end + 1, :) = {W(w).name, fr.res(k).label, fr.res(k).desc, fr.res(k).mult, ...
            fr.res(k).J, fr.res(k).center, fr.res(k).hwhm * opt.SF, fr.res(k).area}; %#ok<AGROW>
    end
end
fitArea = @(lab) fit_area_of(fitRows, lab);

% ---------------------------------------------------------------- 3) normalisation
Href = 2 * C.f;                                   % b = 2f H
if strcmpi(opt.NormBy, 'fit') && ~isnan(fitArea('b'))
    scale = Href / fitArea('b');
else
    scale = Href / raw(ib);
end
I = raw * scale;
getI = @(lab) I(strcmp({regs.label}, lab));
for k = 1:size(fitRows, 1), fitRows{k, 9} = fitRows{k, 8} * scale; end
A = @(lab) fitArea(lab) * scale;

% ---------------------------------------------------------------- 4) derived quantities
D = derive(C, getI, A);

% expected (ideal) areas with nominal n and with n measured here
for k = 1:numel(regs)
    regs(k).ideal_nom = regs(k).ideal(C.f, opt.NominalN * C.f);
    regs(k).ideal_meas = regs(k).ideal(C.f, D.EO);
end

% ---------------------------------------------------------------- 5) output tables
intRows = cell(numel(regs), 10);
for k = 1:numel(regs)
    r = regs(k);
    intRows(k, :) = {r.label, r.assign, r.lo, r.hi, r.mult, raw(k), I(k), r.ideal_nom, ...
        r.ideal_meas, I(k) - r.ideal_meas};
end
intHead = {'label', 'assignment', 'ppm_lo', 'ppm_hi', 'multiplicity', 'raw_area', ...
    sprintf('area_norm_b=%g', Href), sprintf('ideal_H_nominal_n=%.2f', opt.NominalN), ...
    'ideal_H_measured_n', 'deviation_vs_measured_n'};
fitHead = {'window', 'label', 'assignment', 'pattern', 'J_Hz', 'center_ppm', 'HWHM_Hz', ...
    'raw_area', sprintf('area_norm_b=%g', Href)};
derHead = {'quantity', 'value', 'unit', 'formula'};
specHead = {'ppm', 'intensity', 'baseline', 'corrected'};
specRows = num2cell([x, y, base, yc]);

write_sheet(opt.OutFile, 'Integrals', intHead, intRows);
write_sheet(opt.OutFile, 'Fit', fitHead, fitRows);
write_sheet(opt.OutFile, 'Derived', derHead, D.rows);
write_sheet(opt.OutFile, 'Spectrum', specHead, specRows);

R.x = x; R.y = y; R.baseline = base; R.corrected = yc; R.baselineWindowsUsed = used;
R.regions = regs; R.rawArea = raw; R.normArea = I; R.scale = scale;
R.fits = fits; R.fitTable = [fitHead; fitRows]; R.integralTable = [intHead; intRows];
R.derived = [derHead; D.rows]; R.D = D; R.options = opt;

print_summary(R, C);
if opt.Plot
    make_plots(R, C, opt, fname, fdir);
end
end

% =========================================================================
% constants and assignments
% =========================================================================
function C = constants(polyol)
C.M_HDI = 168.20; C.M_NCO = 42.02; C.M_EO = 44.053; C.M_urea = 310.4; C.M_hex = 86.18;
switch polyol
    case 'GE'
        C.f = 3; C.M_core = 92.09; C.core_in_c = 5; C.nominalN = 6.87; C.name = 'GE-EO-(HDI)3';
    case 'PE'
        C.f = 4; C.M_core = 136.15; C.core_in_c = 0; C.nominalN = 3.75; C.name = 'PE-EO-(HDI)4';
    otherwise
        error('Polyol must be ''GE'' or ''PE''.');
end
end

function regs = region_table(polyol)
% label, assignment, lo, hi, multiplicity, ideal H per molecule = fn(f, EO), local baseline
R = {
    'a',      'urethane N-H',                         4.60, 5.10, 'br s',  @(f, EO) f,      true
    'b',      '-CH2-O-C(=O)NH-',                      4.10, 4.30, 't',     @(f, EO) 2 * f, false
    'e',      '-CH2-N=C=O',                           3.24, 3.36, 't',     @(f, EO) 2 * f, false
    'f',      '-NH-CH2-',                             3.08, 3.22, 'q',     @(f, EO) 2 * f, false
    'g+H2O',  '-CH2-CH2-NCO (+ H2O, fit separates)',  1.56, 1.72, 'quint', @(f, EO) 2 * f, false
    'h',      '-NH-CH2-CH2-',                         1.45, 1.56, 'quint', @(f, EO) 2 * f, false
    'i',      'central -CH2-CH2- of HDI',             1.28, 1.45, 'm',     @(f, EO) 4 * f, false
    'ureaNH', 'urea N-H (moisture side product)',     4.30, 4.60, 'br',    @(f, EO) 0, true
    'alloNH', 'allophanate N-H',                      8.00, 9.50, 'br',    @(f, EO) 0, true
    'hexCH3', 'n-hexane CH3 (residual solvent)',      0.80, 0.95, 't',     @(f, EO) 0, true
    };
if strcmp(polyol, 'GE')
    R = [R(1:2, :); {'c+d', 'PEG -OCH2CH2O- + glycerol core (5 H)', 3.48, 3.82, 'm', ...
        @(f, EO) 4 * EO - 2 * f + 5, false}; R(3:end, :)];
else
    R = [R(1:2, :); {'c', 'PEG -OCH2CH2O-', 3.48, 3.82, 'm', @(f, EO) 4 * EO - 2 * f, false}; ...
        {'d', 'core C(CH2O)4', 3.37, 3.47, 's', @(f, EO) 8, true}; R(3:end, :)];
end
regs = cell2struct(R, {'label', 'assign', 'lo', 'hi', 'mult', 'ideal', 'localbl'}, 2);
end

function W = fit_windows(polyol) %#ok<INUSD>
% component: label, description, pattern, J (Hz), centre, centre tolerance (ppm), HWHM bounds (ppm)
mk = @(lab, desc, pat, J, c, tol, wlo, whi) struct('label', lab, 'desc', desc, 'pattern', pat, ...
    'J', J, 'c0', c, 'tol', tol, 'wlo', wlo, 'whi', whi);
W(1).name = 'b 4.21';  W(1).lo = 4.08; W(1).hi = 4.34;
W(1).comps = mk('b', '-CH2-O-C(=O)NH-', 't', 4.8, 4.21, 0.03, 0.0008, 0.010);
W(2).name = 'e/f 3.1-3.4'; W(2).lo = 3.05; W(2).hi = 3.38;
W(2).comps = [mk('e', '-CH2-NCO', 't', 6.6, 3.29, 0.03, 0.0008, 0.010), ...
              mk('f', '-NH-CH2-', 'q', 6.5, 3.16, 0.03, 0.0008, 0.012)];
W(3).name = 'aliphatic 1.2-1.75'; W(3).lo = 1.18; W(3).hi = 1.75;
W(3).comps = [mk('g', '-CH2-CH2-NCO', 'quint', 6.9, 1.61, 0.03, 0.0008, 0.012), ...
              mk('H2O', 'water', 's', 0, 1.60, 0.12, 0.0015, 0.060), ...
              mk('h', '-NH-CH2-CH2-', 'quint', 6.9, 1.50, 0.03, 0.0008, 0.012), ...
              mk('i', 'central CH2 (a)', 'quint', 6.9, 1.385, 0.03, 0.0008, 0.015), ...
              mk('i', 'central CH2 (b)', 'quint', 6.9, 1.335, 0.03, 0.0008, 0.015), ...
              mk('hex', 'hexane CH2 / grease', 's', 0, 1.255, 0.02, 0.0008, 0.020)];
end

% =========================================================================
% numerics
% =========================================================================
function [x, y] = read_spectrum(file)
[~, ~, ext] = fileparts(file);
if exist('readmatrix', 'file') || exist('readmatrix', 'builtin')
    M = readmatrix(file);
elseif any(strcmpi(ext, {'.xlsx', '.xls'}))
    M = xlsread(file);                                       %#ok<XLSRD>
else
    S = importdata(file);
    if isstruct(S), M = S.data; else, M = S; end
end
M = M(:, 1:2);
M = M(all(isfinite(M), 2), :);
[x, o] = sort(M(:, 1));
y = M(o, 2);
end

function [base, used] = fit_baseline(x, y, wins, order)
m = false(size(x));
used = zeros(0, 2);
for k = 1:size(wins, 1)
    mk = x >= wins(k, 1) & x <= wins(k, 2);
    if nnz(mk) > 5, m = m | mk; used(end + 1, :) = wins(k, :); end %#ok<AGROW>
end
order = min(order, max(size(used, 1) - 1, 0));
if nnz(m) < 10
    base = zeros(size(y)); return
end
mu = mean(x); sd = std(x);
pp = polyfit((x(m) - mu) / sd, y(m), order);
base = polyval(pp, (x - mu) / sd);
end

function a = region_integral(x, y, lo, hi, localbl)
% trapezoid integral; localbl = true subtracts a straight line through the mean
% intensity of 0.05 ppm strips just outside the region (for small, isolated signals)
m = x >= lo & x <= hi;
if nnz(m) < 2, a = NaN; return, end
yy = y(m);
if localbl
    mL = x >= lo - 0.05 & x < lo; mR = x > hi & x <= hi + 0.05;
    if nnz(mL) > 2 && nnz(mR) > 2
        yy = yy - interp1([lo hi], [mean(y(mL)) mean(y(mR))], x(m), 'linear', 'extrap');
    end
end
a = trapz(x(m), yy);
end

function v = pv(x, c, w, eta)
% unit-area pseudo-Voigt, w = HWHM
L = (w / pi) ./ ((x - c) .^ 2 + w ^ 2);
s = w / sqrt(2 * log(2));
G = exp(-(x - c) .^ 2 / (2 * s ^ 2)) / (s * sqrt(2 * pi));
v = eta * L + (1 - eta) * G;
end

function w = pattern_weights(pat)
switch pat
    case 's',     w = 1;
    case 'd',     w = [1 1];
    case 't',     w = [1 2 1];
    case 'q',     w = [1 3 3 1];
    case 'quint', w = [1 4 6 4 1];
    otherwise,    w = 1;
end
w = w / sum(w);
end

function B = comp_basis(x, comp, c, w, sf, eta)
wt = pattern_weights(comp.pattern);
m = numel(wt);
B = zeros(size(x));
for k = 1:m
    B = B + wt(k) * pv(x, c + (k - (m + 1) / 2) * comp.J / sf, w, eta);
end
end

function [c, w] = unpack(p, comps)
n = numel(comps);
c = zeros(n, 1); w = zeros(n, 1);
for k = 1:n
    s1 = 1 / (1 + exp(-p(2 * k - 1)));
    s2 = 1 / (1 + exp(-p(2 * k)));
    c(k) = comps(k).c0 - comps(k).tol + 2 * comps(k).tol * s1;
    w(k) = comps(k).wlo + (comps(k).whi - comps(k).wlo) * s2;
end
end

function [r2, Aall, Bm] = vp_resid(p, x, y, comps, sf, eta)
[c, w] = unpack(p, comps);
n = numel(comps);
Bm = zeros(numel(x), n);
for k = 1:n
    Bm(:, k) = comp_basis(x, comps(k), c(k), w(k), sf, eta);
end
xc = (x - mean(x)) / (max(x) - min(x));
Bfull = [Bm, ones(size(x)), -ones(size(x)), xc, -xc];   % free local linear baseline
Aall = lsqnonneg(Bfull, y);
r2 = sum((Bfull * Aall - y) .^ 2);
end

function fr = fit_window(x, y, comps, sf, eta)
n = numel(comps);
p0 = zeros(2 * n, 1);
for k = 1:n                                     % start at the guessed centre, mid-range width
    w0 = min(max(0.0025, comps(k).wlo * 1.5), comps(k).whi * 0.8);
    s = (w0 - comps(k).wlo) / (comps(k).whi - comps(k).wlo);
    p0(2 * k) = log(s / (1 - s));
end
scl = max(abs(y));
obj = @(pp) vp_resid(pp, x, y / scl, comps, sf, eta);
o = optimset('Display', 'off', 'MaxFunEvals', 400 * numel(p0), 'MaxIter', 400 * numel(p0), ...
    'TolX', 1e-7, 'TolFun', 1e-12);
pbest = fminsearch(obj, p0, o);
pbest = fminsearch(obj, pbest, o);                % restart once (escapes simplex collapse)
[~, Aall, Bm] = obj(pbest);
Aall = Aall * scl;
[c, w] = unpack(pbest, comps);
fr.x = x; fr.y = y;
fr.comp = Bm .* repmat(Aall(1:n)', numel(x), 1);
xc = (x - mean(x)) / (max(x) - min(x));
fr.baseline = Aall(n + 1) - Aall(n + 2) + (Aall(n + 3) - Aall(n + 4)) * xc;
fr.total = sum(fr.comp, 2) + fr.baseline;
for k = 1:n
    fr.res(k) = struct('label', comps(k).label, 'desc', comps(k).desc, 'mult', comps(k).pattern, ...
        'J', comps(k).J, 'center', c(k), 'hwhm', w(k), 'area', Aall(k)); %#ok<AGROW>
end
end

function a = fit_area_of(rows, lab)
if isempty(rows), a = NaN; return, end
m = strcmp(rows(:, 2), lab);
if ~any(m), a = NaN; else, a = sum(cell2mat(rows(m, 8))); end
end

% =========================================================================
% derived quantities
% =========================================================================
function D = derive(C, getI, A)
f = C.f;
Ib = getI('b'); Ie = getI('e'); If = getI('f'); Ia = getI('a');
if C.core_in_c > 0, Ic = getI('c+d'); else, Ic = getI('c'); end
D.EO = (Ic - C.core_in_c + Ib) / 4;
D.n = D.EO / f;
D.Mn_polyol = C.M_core + C.M_EO * D.EO;
D.Mn_pp = D.Mn_polyol + C.M_HDI * f;
D.NCO_theor = C.M_NCO * f / D.Mn_pp * 100;
D.x = (Ie - If) / 4;
D.y = max(0, (If - Ib) / 4);
xg = (A('g') - A('h')) / 4;
mass = D.Mn_pp + C.M_HDI * max(D.x, 0) + C.M_urea * D.y;
D.wtHDI = C.M_HDI * max(D.x, 0) / mass * 100;
D.wtUrea = C.M_urea * D.y / mass * 100;
D.NCO_titr = C.M_NCO * (f + 2 * max(D.x, 0) + 2 * D.y) / mass * 100;
hex = getI('hexCH3') / 6;
D.rows = {
    'EO per molecule',                D.EO,        'mol/mol', 'EO = (I_c(+d) - Hcore + I_b)/4'
    'EO per arm, n',                  D.n,         '',        'n = EO / f'
    'polyol Mn',                      D.Mn_polyol, 'g/mol',   'Mn_p = M_core + 44.053*EO'
    'prepolymer Mn (ideal)',          D.Mn_pp,     'g/mol',   'Mn = Mn_p + 168.20*f'
    'theoretical NCO (pure)',         D.NCO_theor, 'wt%',     '42.02*f/Mn*100'
    'free HDI (integrals, upper bd)', D.x,         'mol/mol', 'x = (I_e - I_f)/4'
    'free HDI (fit g - h, indicative)', xg,        'mol/mol', 'x_g = (A_g - A_h)/4; g sits under H2O'
    'HDI-urea-HDI',                   D.y,         'mol/mol', 'y = max(0,(I_f - I_b)/4)'
    'free HDI',                       D.wtHDI,     'wt%',     '168.20*x/(Mn + 168.20*x + 310.4*y)*100'
    'urea dimer',                     D.wtUrea,    'wt%',     '310.4*y/(Mn + 168.20*x + 310.4*y)*100'
    'NCO expected by titration',      D.NCO_titr,  'wt%',     '42.02*(f + 2x + 2y)/(Mn + 168.20*x + 310.4*y)*100'
    'a/b (ideal 0.5)',                Ia / Ib,     '',        'N-H vs CH2OC(O); < 0.5 -> allophanate'
    'f/b (ideal 1)',                  If / Ib,     '',        '> 1 -> urea from moisture'
    'e/f (ideal 1)',                  Ie / If,     '',        '> 1 free HDI/allophanate; < 1 chain extension'
    'g/b from fit (ideal 1)',         A('g') / Ib, '',        'A_g / I_b (+4x + 4y)/I_b expected with impurities'
    'h/b from fit (ideal 1)',         A('h') / Ib, '',        'A_h / I_b'
    'i/b from fit (ideal 2)',         A('i') / Ib, '',        'A_i / I_b (+4x + 8y)/I_b expected with impurities'
    'H2O per molecule (in tube)',     A('H2O') / 2, 'mol/mol', 'A_H2O / 2'
    'n-hexane per molecule',          hex,         'mol/mol', 'I(0.80-0.95)/6'
    'n-hexane',                       C.M_hex * hex / mass * 100, 'wt%', '86.18*hex/m*100'
    };
end

% =========================================================================
% output
% =========================================================================
function write_sheet(outFile, sheet, head, rows)
Cc = [head; rows];
[d, nme, ext] = fileparts(outFile);
if strcmpi(ext, '.xlsx') && (exist('writecell', 'file') || exist('writecell', 'builtin'))
    writecell(Cc, outFile, 'Sheet', sheet);
    return
end
if strcmpi(ext, '.xlsx')
    warning('writecell not available - writing CSV files instead.');
end
fn = fullfile(d, sprintf('%s_%s.csv', nme, sheet));
fid = fopen(fn, 'w');
for r = 1:size(Cc, 1)
    for k = 1:size(Cc, 2)
        v = Cc{r, k};
        if isnumeric(v), s = sprintf('%.6g', v); else, s = ['"' strrep(char(v), '"', '""') '"']; end
        if k < size(Cc, 2), fprintf(fid, '%s,', s); else, fprintf(fid, '%s\n', s); end
    end
end
fclose(fid);
end

function print_summary(R, C)
fprintf('\n%s  (b normalised to %d H)\n', C.name, 2 * C.f);
fprintf('%-8s %-42s %10s %10s %10s\n', 'label', 'assignment', 'area', 'ideal(n)', 'dev');
for k = 1:numel(R.regions)
    r = R.regions(k);
    fprintf('%-8s %-42s %10.2f %10.2f %10.2f\n', r.label, r.assign, R.normArea(k), r.ideal_meas, ...
        R.normArea(k) - r.ideal_meas);
end
fprintf('\nfitted components (normalised):\n');
ft = R.fitTable;
for k = 2:size(ft, 1)
    fprintf('  %-6s %-24s %-6s center %.4f  HWHM %5.2f Hz  area %8.2f\n', ft{k, 2}, ft{k, 3}, ...
        ft{k, 4}, ft{k, 6}, ft{k, 7}, ft{k, 9});
end
fprintf('\nderived:\n');
for k = 2:size(R.derived, 1)
    fprintf('  %-32s %10.3f %-8s %s\n', R.derived{k, 1}, R.derived{k, 2}, R.derived{k, 3}, R.derived{k, 4});
end
end

function make_plots(R, C, opt, fname, fdir)
x = R.x; yc = R.corrected;
inView = x > 0.5 & x < 5.3;
top = max(yc(inView & (x < 3.55 | x > 3.85)));          % scale to the small peaks
f1 = figure('Color', 'w', 'Position', [80 80 1200 560]);
hold on
cols = lines(numel(R.regions));
for k = 1:numel(R.regions)
    r = R.regions(k);
    patch([r.lo r.hi r.hi r.lo], [0 0 1.15 1.15] * top, cols(k, :), 'FaceAlpha', 0.12, 'EdgeColor', 'none');
    text((r.lo + r.hi) / 2, 1.18 * top, sprintf('%s\n%.2f', r.label, R.normArea(k)), ...
        'HorizontalAlignment', 'center', 'FontSize', 8);
end
plot(x, yc, 'k', 'LineWidth', 0.8);
set(gca, 'XDir', 'reverse', 'Box', 'on');
xlim([0.6 5.2]); ylim([-0.05 1.35] * top);
xlabel('\delta (ppm)'); ylabel('intensity (baseline-corrected)');
title(sprintf('%s - regions and normalised areas (b = %d H); c(+d) truncated', C.name, 2 * C.f), ...
    'Interpreter', 'none');
D = R.D;
txt = sprintf(['EO/molecule %.2f   n/arm %.2f   Mn(polyol) %.0f   Mn(prepolymer) %.0f\n' ...
    'theor. NCO %.2f wt%%   free HDI %.3f mol/mol (%.2f wt%%)   urea %.3f mol/mol\n' ...
    'NCO expected by titration %.2f wt%%'], D.EO, D.n, D.Mn_polyol, D.Mn_pp, D.NCO_theor, ...
    D.x, D.wtHDI, D.y, D.NCO_titr);
text(5.15, 0.98 * top, txt, 'FontSize', 8, 'VerticalAlignment', 'top', 'BackgroundColor', 'w');
hold off
print(f1, fullfile(fdir, [fname '_nmr_regions.png']), '-dpng', '-r200');

f2 = figure('Color', 'w', 'Position', [80 80 1200 420]);
for w = 1:numel(R.fits)
    subplot(1, numel(R.fits), w);
    fr = R.fits{w};
    hold on
    plot(fr.x, fr.y, 'k', 'LineWidth', 0.8);
    plot(fr.x, fr.comp + repmat(fr.baseline, 1, size(fr.comp, 2)), 'LineWidth', 0.9);
    plot(fr.x, fr.total, 'r--', 'LineWidth', 1);
    for k = 1:numel(fr.res)
        text(fr.res(k).center, max(fr.y) * (1.02 + 0.06 * mod(k - 1, 2)), ...
            sprintf('%s %.2f', fr.res(k).label, fr.res(k).area * R.scale), ...
            'HorizontalAlignment', 'center', 'FontSize', 8);
    end
    hold off
    set(gca, 'XDir', 'reverse', 'Box', 'on');
    xlim([min(fr.x) max(fr.x)]);
    ylim([min(min(fr.y), 0) max(fr.y) * 1.18]);
    title(fr.name); xlabel('\delta (ppm)');
end
print(f2, fullfile(fdir, [fname '_nmr_fits.png']), '-dpng', '-r200');
end
