"""Third-country chapter: curated overlay + HTML renderers.

The long-form facts live in data/third-country.json (researched and fact-checked 2026-11-14).
This module adds the few things the raw profiles do not do consistently:
  * one counting rule for years (from arrival, including typical processing time)
  * one set of example FX rates for USD comparisons
  * the consequences for a PRC citizen (nationality, hukou, children)
and renders everything into HTML for src/template.html.
"""
import html
import json
import pathlib
import re
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent
DATA = json.loads((ROOT / "data" / "third-country.json").read_text(encoding="utf-8"))
REG = {r["key"]: r for r in DATA["regions"]}

# Example exchange rates used only to compare orders of magnitude (USD per 1 unit).
FX = {"GBP": 1.30, "EUR": 1.15, "CAD": 0.72, "AUD": 0.65, "NZD": 0.58, "SGD": 0.77, "HKD": 0.128,
      "CHF": 1.25, "JPY": 1 / 150}

# pr / cit: (fastest, typical) years from arrival (US: from graduation), incl. typical processing.
# soft: an earlier status that is NOT unconditional permanent residence (drawn lighter).
# reform: values if an announced / proposed reform lands.
X = {
    "us": dict(name="美国（对照）", en="United States", pr=(4, 6.5), cit=(9, 11.5), prname="绿卡（中国大陆出生排期）",
               entry="OPT → H-1B / O-1 → 绿卡", lang="英语", floor="H-1B 按 LCA 现行工资，无统一数额",
               prc="入籍即丧失中国国籍", kid="出生即美国公民（出生地原则）",
               risk="H-1B 抽签与费用提案；中国大陆出生 EB-1/EB-2 排期约 3–5 年",
               note="EB-1 约 4 年、EB-2 约 6.5 年，按 2026-11 排期粗估"),
    "canada": dict(name="加拿大", en="Canada", pr=(1.5, 2.5), cit=(4.5, 5), prname="永久居民 PR",
                   entry="GTS 工签（约 2 周）· C44 博后工签", lang="英语 / 法语",
                   floor="无全国门槛；GTS B 类按现行工资",
                   prc="入籍即丧失中国国籍", kid="出生即加拿大公民（出生地原则）",
                   risk="2026-11-03 CRS 改革，抽选暂停重算；EE 拟合并",
                   route4=[("GTS 工签 / C44 博后", "全球人才通道约 2 周出签"), ("在加拿大工作满 12 个月", "CRS 打分 · 类别抽选"),
                           ("Express Entry 永居", "审理约 6 个月"), ("入籍", "5 年内住满 1,095 天")],
                   note="先工作 12 个月再走 Express Entry"),
    "uk": dict(name="英国", en="United Kingdom", pr=(3.5, 5.5), cit=(5.5, 7), reform=(10.5, 12), prname="ILR 定居",
               entry="Global Talent · HPI（34 所美校）· Skilled Worker", lang="英语",
               floor="£41,700 或 going rate 取高；STEM 博士底线 £33,400",
               prc="入籍即丧失中国国籍", kid="父母一方已获 ILR 或为英国公民时，出生即英国公民",
               risk="挣得定居：永居基准将延长到 10 年，生效日未定",
               route4=[("Global Talent / HPI / SW", "GT 快速背书约 2 周"), ("连续居住 3 或 5 年", "改革后基准 10 年"),
                       ("ILR 定居", "£3,226 · Life in the UK 考试"), ("入籍", "持 ILR 满 12 个月")],
               note="现行 GT 3 年 / SW 5 年；改革后收入低于 £50,271 约 10 年"),
    "australia": dict(name="澳大利亚", en="Australia", pr=(0.5, 3), cit=(5, 5.5), prname="永居 PR",
                      entry="482 雇主担保 · 858 国家创新（邀请制）", lang="英语",
                      floor="482 Core AUD 79,423；Specialist AUD 146,576",
                      prc="入籍即丧失中国国籍", kid="父母一方为澳洲公民或永居时，出生即澳洲公民",
                      risk="2026-07 起多数签证首期申请费涨 25%",
                      route4=[("482 雇主担保 / 858", "858 获邀即拿永居"), ("为担保雇主工作约 2 年", "186 临时转永居"),
                              ("永居 PR", "186 · 189 · 858"), ("入籍", "在澳 4 年，其中 PR 1 年")],
                      note="0.5 年只适用于获邀的 858；多数人约 3 年"),
    "newzealand": dict(name="新西兰", en="New Zealand", soft=(0.5, 1), softname="居民签证", pr=(2.5, 3), cit=(6, 6.5),
                       reform=(None, 11), prname="永久居民签证 PRV",
                       entry="认证雇主工签 → SMC 积分 / 绿色清单", lang="英语",
                       floor="SMC 时薪 ≥ NZD 35（约 NZD 72,800/年）",
                       prc="入籍即丧失中国国籍", kid="父母一方为公民或可无限期居留时，出生即新西兰公民",
                       risk="2026-11-07 大选后可能收紧（正式结果 11-27）",
                       route4=[("认证雇主技术岗 offer", "时薪 ≥ NZD 35"), ("SMC 积分满 6 分", "LQEA 名单院校博士直接满分"),
                               ("居民签证 → PRV", "居民签证首 2 年有旅行条件"), ("入籍", "持居民签证满 5 年")],
                       note="居民签证约 1 年内（有旅行条件）；无条件 PRV 约 2.5–3 年"),
    "hongkong": dict(name="中国香港", en="Hong Kong SAR", pr=(7, 7.5), cit=None, prname="永久性居民（居留权）",
                     entry="高才通 · 优才 · 一般就业政策", lang="中文（粤语）/ 英文",
                     floor="无固定门槛，按市场水平",
                     prc="不涉及国籍变动；内地户口如何处理需核实", kid="孩子为中国国籍；永久居民身份按《基本法》第 24 条认定",
                     risk="续签越来越看实际就业、收入与在港纳税",
                     route4=[("高才通 / 优才 / GEP", "高才通 B/C 只认本科院校"), ("连续通常居住 7 年", "续签看就业、收入与纳税"),
                             ("香港永久性居民", "居留权"), ("无入籍步骤", "本来就是中国国籍")],
                     note="7 年是法定门槛，不能缩短"),
    "singapore": dict(name="新加坡", en="Singapore", pr=(1.5, 3.5), pr_dash=True, cit=(4.5, 7), prname="永久居民 PR（酌情审批）",
                      entry="EP 就业准证（COMPASS ≥ 40 分）· ONE Pass", lang="英语（华语通用）",
                      floor="EP 月薪 S$5,600 起，随年龄递增；2027 年起 S$6,000 起",
                      prc="入籍须放弃中国国籍", kid="仅当父母一方为新加坡公民时，出生即为公民",
                      risk="PR 没有积分和固定年限，可能多次被拒",
                      route4=[("EP / ONE Pass", "COMPASS ≥ 40 分"), ("工作约半年后可申请 PR", "ICA 酌情审批"),
                              ("永久居民 PR", "被拒可再申请"), ("入籍", "PR 满 2 年可申请")],
                      note="PR 时间是估算，也可能一直拿不到"),
    "germany": dict(name="德国（欧盟蓝卡）", en="Germany · EU Blue Card", pr=(2, 3), cit=(5.5, 7), prname="永居 Niederlassungserlaubnis",
                    entry="欧盟蓝卡（€50,700）· §18d 研究者居留", lang="德语（科研和科技岗常用英语）",
                    floor="蓝卡 €50,700；应届生和短缺职业 €45,934",
                    prc="德国允许多国籍，但入德籍即丧失中国国籍", kid="父母一方合法常住满 5 年且有无限期居留权时，出生即德国公民",
                    risk="媒体报道敏感 STEM 领域对中国研究者审查趋严",
                    route4=[("欧盟蓝卡 / 研究者居留", "2026 年薪门槛 €50,700"), ("工作 21 个月 + B1 德语", "只有 A1 德语时为 27 个月"),
                            ("永居", "Niederlassungserlaubnis"), ("入籍", "居住 5 年 · B1 德语")],
                    note="21 个月需 B1 德语；3 年入籍快速通道已于 2025-10 废除"),
    "netherlands": dict(name="荷兰", en="Netherlands", pr=(5.5, 6.5), cit=(6, 7), prname="永居 / 欧盟长期居民",
                        entry="高技术移民 kennismigrant（应届门槛 €3,122/月）", lang="荷兰语（职场英语普及）",
                        floor="月薪 €5,942（30 岁以上）/ €4,357 / 应届 €3,122",
                        prc="入籍原则上须放弃原国籍", kid="不因在荷兰出生获得国籍",
                        risk="高技术移民收紧方案与入籍新规均在推进",
                        route4=[("高技术移民 / 蓝卡 / 科研许可", "大学科研岗只需最低收入标准"), ("合法居住 5 年", "求职年不计入"),
                                ("永居或 EU 长期居民", "A2 融入考试"), ("入籍", "满 5 年可直接申请")],
                        note="可以不先拿永居，满 5 年直接申请入籍"),
    "france": dict(name="法国", en="France", pr=(5.5, 6), cit=(6.5, 7), prname="10 年长期居民卡",
                   entry="Talent 研究员卡（无工资门槛）· Talent 蓝卡", lang="法语",
                   floor="蓝卡 €59,373；合格雇员 €39,582；研究员卡无门槛",
                   prc="入籍即丧失中国国籍", kid="在法国出生不自动获得国籍，成年前满足居住条件可取得",
                   risk="2026 起长期身份需法语 B1/B2 + 公民考试；规费上涨",
                   route4=[("Talent 研究员卡 / 蓝卡", "研究员卡无工资门槛"), ("合法居住 5 年", "法语 B1 + 公民考试"),
                           ("10 年长期居民卡", "入籍不要求先拿"), ("入籍", "5 年 · 法语 B2")],
                   note="5 年是硬门槛；入籍审理最长 18 个月"),
    "ireland": dict(name="爱尔兰", en="Ireland", soft=(1.75, 2.5), softname="Stamp 4", pr=(5, 5.5), cit=(6, 6.5),
                    reform=(None, 9), prname="长期居留 LTR",
                    entry="关键技能就业许可 CSEP（€40,904 起）", lang="英语",
                    floor="CSEP 清单职位 €40,904；非清单 €68,911",
                    prc="入籍须放弃中国国籍", kid="父母一方出生前 4 年内有 3 年可计居住时，孩子有权成为爱尔兰公民",
                    risk="入籍居住要求拟从 5 年延长到 8 年（议会审议中）",
                    route4=[("CSEP 关键技能许可", "配偶可直接工作"), ("满 21 个月 → Stamp 4", "Stamp 4 不是永居，2 年一续"),
                            ("长期居留 LTR", "满 60 个月"), ("入籍", "5 年（拟改为 8 年）")],
                    note="Stamp 4 约 2 年（可续，不是永居）；LTR 满 5 年"),
    "switzerland": dict(name="瑞士", en="Switzerland", soft=(0, 0), softname="教授任命", pr=(5, 10), cit=(12, 12.5),
                        prname="C 证定居许可",
                        entry="B 证（计配额）· 教授任命常当场获 C 证", lang="德语 / 法语 / 意大利语",
                        floor="无统一门槛，按当地行业惯例工资",
                        prc="入籍即丧失中国国籍", kid="不因在瑞士出生获得国籍",
                        risk="非欧盟配额与本地优先审查；法案 26.045 未生效",
                        route4=[("B 证（计配额）/ 教授任命", "教授常在任命时获 C 证"), ("居住 10 年", "口语 B1 可缩短到 5 年"),
                                ("C 证定居许可", "不符合融入要求可降回 B 证"), ("入籍", "居住 10 年 + C 证 + 州要求")],
                        note="0 年只适用于获任命的教授；工业界 5–10 年"),
    "japan": dict(name="日本", en="Japan", pr=(1.5, 3.5), cit=(11, 11), prname="永住",
                  entry="高度专门职 1 号（积分 ≥ 70，博士 30 分）", lang="日语（研究岗可用英语）",
                  floor="ロ 类年薪 ≥ ¥300 万（拟上调）；イ 类无门槛",
                  prc="入籍须放弃中国国籍，需另办退籍（待核实）", kid="不因在日本出生获得国籍",
                  risk="2026 起入籍实务约 10 年；2027-04 起永住审查更严",
                  route4=[("高度专门职 1 号", "博士 30 分 · 合格线 70 分"), ("80 分满 1 年 / 70 分满 3 年", "可申请永住"),
                          ("永住", "手续费 ¥200,000"), ("入籍", "实务要求约 10 年")],
                  note="80 分可 1 年申请永住；入籍 2026 年起实务约 10 年"),
}
ORDER = ["canada", "uk", "australia", "newzealand", "hongkong", "singapore",
         "germany", "netherlands", "france", "ireland", "switzerland", "japan"]

KIND = {"work": "工作", "talent": "人才", "pr-direct": "直接永居", "post-study": "毕业后过渡", "startup": "创业", "other": "其他"}
STATUS = {"in_force": ("live", "生效"), "announced": ("prop", "已宣布"), "proposed": ("prop", "提案"),
          "blocked_or_paused": ("held", "暂停")}
DUAL = re.compile(r"双重国籍|多重国籍|多国籍")


def esc(s):
    return html.escape(str(s), quote=True)


def yr(v):
    return f"{v:g}"


def span(pair):
    if pair is None:
        return "—"
    a, b = pair
    return f"约 {yr(a)} 年" if a == b else f"约 {yr(a)}–{yr(b)} 年"


def rich(s):
    """Plain text with blank-line paragraphs, '- ' bullets and '1. ' numbered lines -> HTML."""
    out = []
    for block in re.split(r"\n\s*\n", str(s).strip()):
        lines = [x.rstrip() for x in block.split("\n") if x.strip()]
        buf, kind = [], None

        def flush():
            nonlocal buf, kind
            if buf:
                tag = "ol" if kind == "ol" else "ul"
                out.append(f"<{tag}>" + "".join(f"<li>{esc(x)}</li>" for x in buf) + f"</{tag}>")
            buf, kind = [], None

        for ln in lines:
            m_ul = re.match(r"^\s*[-•]\s+(.*)", ln)
            m_ol = re.match(r"^\s*\d+[.)、]\s*(.*)", ln)
            if m_ul:
                if kind != "ul":
                    flush()
                kind = "ul"
                buf.append(m_ul.group(1))
            elif m_ol:
                if kind != "ol":
                    flush()
                kind = "ol"
                buf.append(m_ol.group(1))
            else:
                flush()
                out.append(f"<p>{esc(ln)}</p>")
        flush()
    return "".join(out)


def host(u):
    h = urlparse(u).netloc.lower()
    return h[4:] if h.startswith("www.") else h


def src_links(urls):
    seen, out = set(), []
    for u in urls:
        for part in re.split(r"\s*;\s*", u):
            part = part.strip()
            if part.startswith("http") and part not in seen:
                seen.add(part)
                out.append(f'<a href="{esc(part)}" target="_blank" rel="noopener">{esc(host(part))}</a>')
    return out


# ------------------------------------------------------------------ pieces
def prc_box(key):
    o = X[key]
    r = REG[key]
    dual = [p for p in r.get("pros_zh", []) if DUAL.search(p)]
    extra = ""
    if dual and key != "hongkong":
        extra = ("<li>该国允许双重国籍，但对中国公民不起作用：中国不承认双重国籍，入籍即丧失中国国籍（《国籍法》第 9 条）。"
                 "它主要影响在当地出生的子女，以及中国政策将来是否变化。</li>")
    return (f'<div class="xprc"><h4>对中国公民意味着什么</h4><ul>'
            f"<li><b>国籍</b>：{esc(o['prc'])}。</li>"
            f"<li><b>在当地出生的孩子</b>：{esc(o['kid'])}（概括，以当地国籍法为准）。</li>{extra}</ul></div>")


def route_html(rt):
    rows = [("适合谁", esc(rt.get("who_for", "")))]
    reqs = rt.get("key_requirements") or []
    if reqs:
        rows.append(("关键要求", "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in reqs) + "</ul>"))
    for k, lab in (("duration", "有效期"), ("processing_time", "审理时间"), ("cost", "费用"),
                   ("leads_to_pr", "能否转永居"), ("status_2026", "2026 状态")):
        if rt.get(k):
            rows.append((lab, rich(rt[k])))
    links = src_links(rt.get("sources", []))
    if links:
        rows.append(("来源", f"<p class=\"xsrc\">{' · '.join(links)}</p>"))
    kind = KIND.get(rt.get("kind"), "其他")
    dl = "".join(f"<dt>{a}</dt><dd>{b}</dd>" for a, b in rows)
    return (f'<details class="xroute"><summary><span>{esc(rt["name_zh"])}'
            f'<small>{esc(rt.get("name_en", ""))}</small></span><span class="badge b">{kind}</span></summary>'
            f"<dl>{dl}</dl></details>")


def panel(key):
    r, o = REG[key], X[key]
    pr, cit = r["pr"], r["citizenship"]
    fam = r["family"]
    edu = r["education"]
    head = (f'<header class="xhead"><h3>{esc(o["name"])} <small>{esc(o["en"])}</small></h3>'
            f'<div class="xfacts"><span class="stamp x">永居 {span(o["pr"])}</span>'
            + (f'<span class="stamp x">入籍 {span(o["cit"])}</span>' if o.get("cit") else '<span class="stamp x">无入籍步骤</span>')
            + f'<span class="stamp data">{esc(o["lang"])}</span></div></header>')
    verdict = f'<p class="xverdict">{esc(r["one_line_verdict_zh"])}</p>'
    best = f'<div class="xbest"><h4>对美国博士的推荐路径</h4>{rich(r["best_route_for_us_phd"])}</div>'
    routes = "<h4>签证与居留路线（点开看要求、费用、审理时间和来源）</h4>" + "".join(route_html(x) for x in r["routes"])
    steps = "".join(f"<li>{esc(s)}</li>" for s in pr.get("steps", []))
    pr_card = (f'<div class="card"><h4>永居：{esc(pr.get("name", ""))}</h4>'
               f'<p class="xnum">按本页统一口径（从抵达起算，含常见审理时间）：<b>{span(o["pr"])}</b>'
               + (f'；{esc(o["softname"])} {span(o["soft"])}' if o.get("soft") else "")
               + f'</p><ol>{steps}</ol>'
               + (f'<div class="xnote">{rich(pr["notes"])}</div>' if pr.get("notes") else "") + "</div>")
    cit_card = (f'<div class="card"><h4>入籍</h4>'
                f'<p class="xnum">按本页统一口径：<b>{span(o.get("cit"))}</b>'
                + (f'；若改革落地约 {yr(o["reform"][1])} 年' if o.get("reform") and o["reform"][1] else "")
                + f'</p><p>{esc(cit.get("years_after_pr_or_residence", ""))}</p>'
                + f'<p><b>语言 / 考试：</b>{esc(cit.get("language_or_test", ""))}</p>'
                + f'<div class="xnote">{rich(cit.get("notes", ""))}</div></div>')
    fam_card = (f'<div class="card"><h4>配偶与孩子</h4><p><b>配偶工作：</b></p>{rich(fam.get("spouse_can_work", ""))}'
                f'<p><b>孩子上学：</b></p>{rich(fam.get("kids_schooling", ""))}</div>')
    sal_card = f'<div class="card"><h4>工资门槛</h4>{rich(r.get("salary_threshold", ""))}</div>'
    edu_rows = [("学制", edu.get("school_structure")), ("义务教育", edu.get("compulsory_ages")),
                ("大学与学位", edu.get("university_and_degrees")), ("博士年限", edu.get("phd_typical_years")),
                ("学术职级", edu.get("academic_ranks")), ("备注", edu.get("notes"))]
    edu_card = ('<div class="card xedu"><h4>教育体系速览</h4><dl>'
                + "".join(f"<dt>{a}</dt><dd>{rich(b)}</dd>" for a, b in edu_rows if b) + "</dl></div>")
    ch = []
    for c in sorted(r.get("recent_changes", []), key=lambda c: c.get("date", "")):
        cls, lab = STATUS.get(c.get("status"), ("prop", c.get("status", "")))
        links = src_links([c.get("source", "")])
        ch.append(f'<li><span class="stamp {cls}">{lab}</span><div><span class="num">{esc(c.get("date", ""))}</span>'
                  f'<p>{esc(c.get("change_zh", ""))}</p>' + (f'<p class="xsrc">{" · ".join(links)}</p>' if links else "")
                  + "</div></li>")
    changes = f'<div class="blk"><h4>2025–2026 年的变化</h4><ol class="watch xwatch">{"".join(ch)}</ol></div>'
    pros = [p for p in r.get("pros_zh", []) if not (DUAL.search(p) and key != "hongkong")]
    pc = ('<div class="grid2"><div class="card xpro"><h4>优点</h4><ul>' + "".join(f"<li>{esc(p)}</li>" for p in pros)
          + '</ul></div><div class="card xcon"><h4>代价与风险</h4><ul>'
          + "".join(f"<li>{esc(p)}</li>" for p in r.get("cons_zh", [])) + "</ul></div></div>")
    unc = r.get("uncertain") or []
    unc_html = (f'<details class="xunc"><summary>尚未核实或仍不确定（{len(unc)} 条）</summary><ul>'
                + "".join(f"<li>{esc(u)}</li>" for u in unc) + "</ul></details>") if unc else ""
    return (f'<article class="xpanel" id="x-{key}" data-xpanel="{key}" hidden>{head}{verdict}{prc_box(key)}{best}'
            f'<div class="xroutes">{routes}</div><div class="grid2">{pr_card}{cit_card}</div>'
            f'<div class="grid2">{fam_card}{sal_card}</div>{edu_card}{changes}{pc}{unc_html}</article>')


def tabs():
    b = "".join(f'<button class="chip" data-x="{k}" aria-pressed="false">{esc(X[k]["name"])}</button>' for k in ORDER)
    return f'<div class="chips xtabs" role="group" aria-label="选择地区">{b}</div>'


def panels():
    return tabs() + "".join(panel(k) for k in ORDER)


def compare_table():
    head = ("<thead><tr><th>地区</th><th>美国博士的首选入口</th><th>主要工签工资门槛</th>"
            "<th>永居（从抵达起）</th><th>入籍（从抵达起）</th><th>语言</th><th>对中国国籍</th>"
            "<th>在当地出生的孩子</th><th>2026 主要变数</th></tr></thead>")
    rows = []
    for k in ["us"] + ORDER:
        o = X[k]
        prs = span(o["pr"])
        if o.get("soft"):
            prs = f'{esc(o["softname"])} {span(o["soft"])}<br>{esc(o["prname"])} {prs}'
        else:
            prs = f'{esc(o["prname"])}<br>{prs}'
        cit = span(o.get("cit")) if o.get("cit") else "无入籍步骤"
        if o.get("reform") and o["reform"][1]:
            cit += f'<br><span class="xwarn">改革后约 {yr(o["reform"][1])} 年</span>'
        name = (f'<a href="#abroad" data-x="{k}">{esc(o["name"])}</a>' if k != "us" else esc(o["name"]))
        trc = ' class="xbase"' if k == "us" else ""
        rows.append(f"<tr{trc}><th>{name}</th><td>{esc(o['entry'])}</td>"
                    f"<td>{esc(o['floor'])}</td><td>{prs}</td><td>{cit}</td><td>{esc(o['lang'])}</td>"
                    f"<td>{esc(o['prc'])}</td><td>{esc(o['kid'])}</td><td>{esc(o['risk'])}</td></tr>")
    return f'<div class="tbl xtbl"><table>{head}<tbody>{"".join(rows)}</tbody></table></div>'


def edu_table():
    head = "<thead><tr><th>地区</th><th>义务教育</th><th>博士年限</th><th>起步教职（约等于 Assistant Prof）</th></tr></thead>"
    start = {"canada": "Assistant Professor（tenure-track）", "uk": "Lecturer", "australia": "Lecturer（Level B）",
             "newzealand": "Lecturer", "hongkong": "Assistant Professor", "singapore": "Assistant Professor（tenure track）",
             "germany": "Juniorprofessor（W1）/ 青年研究组组长", "netherlands": "Universitair docent（UD）",
             "france": "Maître de conférences（终身公务员）", "ireland": "Assistant Professor / Lecturer",
             "switzerland": "Assistant Professor（tenure track）", "japan": "助教 / 講師"}
    rows = []
    for k in ORDER:
        e = REG[k]["education"]
        rows.append(f"<tr><th>{esc(X[k]['name'])}</th><td>{esc(first(e.get('compulsory_ages', '')))}</td>"
                    f"<td>{esc(first(e.get('phd_typical_years', '')))}</td><td>{esc(start[k])}</td></tr>")
    return f'<div class="tbl"><table>{head}<tbody>{"".join(rows)}</tbody></table></div>'


def first(s, n=70):
    s = re.split(r"(?<=[。；])", str(s).replace("\n", " "))[0].strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def others():
    items = []
    for o in DATA.get("other_destinations_unverified", []):
        links = src_links([o.get("source", "")])
        items.append(f'<div class="card"><h4>{esc(o["name"])}</h4><p>{esc(o["facts"])}</p>'
                     + (f'<p class="xsrc">{" · ".join(links)}</p>' if links else "") + "</div>")
    return '<div class="grid3">' + "".join(items) + "</div>"


def all_sources():
    out = []
    for k in ORDER:
        urls = []
        for rt in REG[k]["routes"]:
            urls += rt.get("sources", [])
        for c in REG[k].get("recent_changes", []):
            urls.append(c.get("source", ""))
        links = src_links(urls)[:8]
        out.append(f"<li>{esc(X[k]['name'])}：{' · '.join(links)}</li>")
    return "".join(out)


HTML = {
    "abroad-table": compare_table,
    "abroad-panels": panels,
    "abroad-edu": edu_table,
    "abroad-others": others,
    "abroad-sources": all_sources,
}
