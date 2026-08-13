import type { Tool } from "./types";

const n = (v: string | undefined) => {
  const parsed = Number.parseFloat((v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const fmt = (value: number, decimals = 2) => {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 10 ** decimals) / 10 ** decimals;
  return rounded.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

const money = (value: number) => fmt(value, 2);

const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000);

export const calculatorTools: Tool[] = [
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    category: "calculators",
    tagline: "Find X% of a number in one tap.",
    description:
      "Free percentage calculator: work out what X% of a number is, with the formula, a worked example and answers to common percentage questions.",
    keywords: ["percentage calculator", "percent of a number", "calculate percentage"],
    popular: true,
    addedAt: "2024-01-10",
    about:
      "A percentage is simply a fraction of 100. This calculator answers the most common version of the question — what is X percent of Y — and shows the arithmetic so you can repeat it by hand. It is useful for tips, tax, commission, test scores and quick sanity checks at the shops.",
    formula: "Result = (Percentage ÷ 100) × Value",
    howTo: [
      "Type the percentage you want to find, for example 15.",
      "Type the value it applies to, for example 240.",
      "Press Calculate to see the result and the share of the total.",
    ],
    example:
      "15% of 240 → (15 ÷ 100) × 240 = 36. So a 15% tip on a 240 bill is 36, and the total becomes 276.",
    faqs: [
      {
        q: "How do I calculate a percentage without a calculator?",
        a: "Divide the number by 100 to get 1%, then multiply by the percentage you need. For 15% of 240: 240 ÷ 100 = 2.4, and 2.4 × 15 = 36.",
      },
      {
        q: "How do I turn a fraction into a percentage?",
        a: "Divide the part by the whole and multiply by 100. 36 out of 240 is 36 ÷ 240 × 100 = 15%.",
      },
      {
        q: "Is my data sent anywhere?",
        a: "No. The calculation runs entirely in your browser, so nothing you type is uploaded or stored.",
      },
    ],
    related: ["percentage-increase-calculator", "discount-calculator", "profit-calculator", "grade-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "percent", label: "Percentage", suffix: "%", placeholder: "15" },
        { name: "value", label: "Of value", placeholder: "240" },
      ],
      compute: (v) => {
        const p = n(v["percent"]);
        const value = n(v["value"]);
        if (Number.isNaN(p) || Number.isNaN(value)) return { error: "Enter a percentage and a value." };
        const result = (p / 100) * value;
        return {
          label: `${fmt(p)}% of ${fmt(value)}`,
          value: fmt(result, 4),
          notes: [
            `Formula: (${fmt(p)} ÷ 100) × ${fmt(value)} = ${fmt(result, 4)}`,
            `Value plus the percentage: ${fmt(value + result, 4)}`,
            `Value minus the percentage: ${fmt(value - result, 4)}`,
          ],
        };
      },
    },
  },
  {
    slug: "percentage-increase-calculator",
    name: "Percentage Increase/Decrease Calculator",
    category: "calculators",
    tagline: "Measure change between two numbers.",
    description:
      "Calculate the percentage increase or decrease between an old and a new value, with the change formula and a clear worked example.",
    keywords: ["percentage increase calculator", "percentage decrease", "percent change"],
    addedAt: "2024-01-14",
    about:
      "Percentage change tells you how much a value has grown or shrunk relative to where it started. It is the right measure for price rises, salary reviews, traffic growth and month-over-month reporting, because it puts the change in proportion to the original number.",
    formula: "Change % = ((New − Old) ÷ |Old|) × 100",
    howTo: [
      "Enter the original (old) value.",
      "Enter the new value you are comparing against.",
      "Press Calculate — a positive result is an increase, a negative one is a decrease.",
    ],
    example:
      "A price moves from 80 to 92: ((92 − 80) ÷ 80) × 100 = 15% increase. Going back from 92 to 80 is a 13.04% decrease — the two percentages are not symmetrical because the base changes.",
    faqs: [
      {
        q: "Why isn't a 20% rise cancelled by a 20% fall?",
        a: "Each percentage is taken from a different base. 100 raised by 20% is 120; 120 reduced by 20% is 96, not 100.",
      },
      {
        q: "What if the original value is zero?",
        a: "Percentage change is undefined when the starting value is zero, because you cannot divide by zero. Report the absolute change instead.",
      },
    ],
    related: ["percentage-calculator", "discount-calculator", "profit-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "oldValue", label: "Original value", placeholder: "80" },
        { name: "newValue", label: "New value", placeholder: "92" },
      ],
      compute: (v) => {
        const o = n(v["oldValue"]);
        const nv = n(v["newValue"]);
        if (Number.isNaN(o) || Number.isNaN(nv)) return { error: "Enter both values." };
        if (o === 0) return { error: "The original value cannot be zero." };
        const change = ((nv - o) / Math.abs(o)) * 100;
        return {
          label: change >= 0 ? "Percentage increase" : "Percentage decrease",
          value: `${fmt(Math.abs(change), 2)}%`,
          notes: [
            `Absolute change: ${fmt(nv - o, 4)}`,
            `Formula: ((${fmt(nv)} − ${fmt(o)}) ÷ ${fmt(Math.abs(o))}) × 100`,
          ],
        };
      },
    },
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    tagline: "Your exact age in years, months and days.",
    description:
      "Calculate your exact age from a date of birth — in years, months and days, plus total days and your next birthday countdown.",
    keywords: ["age calculator", "date of birth calculator", "how old am I"],
    popular: true,
    addedAt: "2024-01-12",
    about:
      "This age calculator counts calendar years, months and days between a birth date and any reference date, taking leap years and uneven month lengths into account. Use it for forms, eligibility checks, or simply to see how many days you have been alive.",
    howTo: [
      "Pick your date of birth.",
      "Leave the second date as today, or set a date in the future or past.",
      "Press Calculate to see years, months, days and your next birthday.",
    ],
    example:
      "Someone born on 14 March 1996, measured on 10 August 2026, is 30 years, 4 months and 27 days old — about 11,106 days.",
    faqs: [
      {
        q: "How are leap years handled?",
        a: "The calculator walks real calendar dates, so 29 February and every leap day in between is counted correctly.",
      },
      {
        q: "Can I calculate age at a past or future date?",
        a: "Yes. Change the second date to any date you like, for example the closing date of an application.",
      },
    ],
    related: ["date-difference-calculator", "time-calculator", "bmi-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "dob", label: "Date of birth", type: "date" },
        { name: "on", label: "Age on date", type: "date", hint: "Defaults to today" },
      ],
      compute: (v) => {
        if (!v["dob"]) return { error: "Please choose a date of birth." };
        const birth = new Date(`${v["dob"]}T00:00:00`);
        const on = v["on"] ? new Date(`${v["on"]}T00:00:00`) : new Date(new Date().toDateString());
        if (Number.isNaN(birth.getTime()) || Number.isNaN(on.getTime()))
          return { error: "Please enter valid dates." };
        if (birth > on) return { error: "The date of birth must come before the reference date." };

        let years = on.getFullYear() - birth.getFullYear();
        let months = on.getMonth() - birth.getMonth();
        let days = on.getDate() - birth.getDate();
        if (days < 0) {
          months -= 1;
          days += new Date(on.getFullYear(), on.getMonth(), 0).getDate();
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }
        const totalDays = daysBetween(birth, on);
        const next = new Date(on.getFullYear(), birth.getMonth(), birth.getDate());
        if (next < on) next.setFullYear(next.getFullYear() + 1);
        return {
          label: "Age",
          value: `${years} years, ${months} months, ${days} days`,
          notes: [
            `Total days lived: ${totalDays.toLocaleString()}`,
            `Total weeks: ${fmt(totalDays / 7, 1)}`,
            `Next birthday: ${next.toDateString()} (in ${daysBetween(on, next)} days)`,
          ],
        };
      },
    },
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    category: "calculators",
    tagline: "Sale price and money saved, instantly.",
    description:
      "Work out the sale price and the amount you save from any discount percentage. Includes the discount formula and a worked shopping example.",
    keywords: ["discount calculator", "sale price calculator", "percent off"],
    popular: true,
    addedAt: "2024-01-11",
    about:
      "Retail discounts are quoted as a percentage off the original price. This calculator converts that percentage into the two numbers you actually care about: what you pay, and what you save.",
    formula: "Sale price = Original × (1 − Discount ÷ 100)",
    howTo: [
      "Enter the original price of the item.",
      "Enter the discount percentage shown on the label.",
      "Press Calculate to see the final price and your saving.",
    ],
    example:
      "A 129.99 jacket at 35% off: 129.99 × (1 − 0.35) = 84.49. You save 45.50.",
    faqs: [
      {
        q: "How do I combine two discounts?",
        a: "Apply them one after another, not by adding them. 20% then 10% off 100 gives 100 × 0.8 × 0.9 = 72, which is a 28% total discount, not 30%.",
      },
      {
        q: "Does this include sales tax or VAT?",
        a: "No. Calculate the discount first, then add any tax to the discounted price.",
      },
    ],
    related: ["percentage-calculator", "profit-calculator", "percentage-increase-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "price", label: "Original price", placeholder: "129.99" },
        { name: "discount", label: "Discount", suffix: "%", placeholder: "35" },
      ],
      compute: (v) => {
        const price = n(v["price"]);
        const d = n(v["discount"]);
        if (Number.isNaN(price) || Number.isNaN(d)) return { error: "Enter a price and a discount." };
        if (d < 0 || d > 100) return { error: "The discount must be between 0 and 100%." };
        const saved = (price * d) / 100;
        return {
          label: "You pay",
          value: money(price - saved),
          notes: [`You save: ${money(saved)}`, `Formula: ${money(price)} × (1 − ${fmt(d)} ÷ 100)`],
        };
      },
    },
  },
  {
    slug: "profit-calculator",
    name: "Profit Calculator",
    category: "calculators",
    tagline: "Profit, margin and markup from cost and price.",
    description:
      "Calculate gross profit, profit margin and markup from your cost and selling price, with the difference between margin and markup explained.",
    keywords: ["profit calculator", "profit margin calculator", "markup calculator"],
    addedAt: "2024-01-20",
    about:
      "Margin and markup describe the same profit from two different angles: margin is profit as a share of the selling price, markup is profit as a share of the cost. Mixing them up is one of the most common pricing mistakes in small business, so this calculator always shows both.",
    formula: "Profit = Price − Cost · Margin % = Profit ÷ Price × 100 · Markup % = Profit ÷ Cost × 100",
    howTo: [
      "Enter what the item costs you.",
      "Enter the price you sell it for.",
      "Press Calculate to see profit, margin and markup side by side.",
    ],
    example:
      "Cost 40, price 100: profit is 60, margin is 60% and markup is 150%. The same trade looks very different depending on which measure you quote.",
    faqs: [
      {
        q: "What is the difference between margin and markup?",
        a: "Margin divides profit by the selling price; markup divides profit by the cost. Markup is always the larger number.",
      },
      {
        q: "Is this gross or net profit?",
        a: "It is gross profit. Overheads such as rent, shipping and payment fees are not included.",
      },
    ],
    related: ["percentage-calculator", "discount-calculator", "salary-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "cost", label: "Cost price", placeholder: "40" },
        { name: "price", label: "Selling price", placeholder: "100" },
      ],
      compute: (v) => {
        const cost = n(v["cost"]);
        const price = n(v["price"]);
        if (Number.isNaN(cost) || Number.isNaN(price)) return { error: "Enter cost and selling price." };
        if (cost <= 0 || price <= 0) return { error: "Both values must be greater than zero." };
        const profit = price - cost;
        return {
          label: profit >= 0 ? "Gross profit" : "Loss",
          value: money(Math.abs(profit)),
          notes: [
            `Profit margin: ${fmt((profit / price) * 100)}%`,
            `Markup: ${fmt((profit / cost) * 100)}%`,
          ],
        };
      },
    },
  },
  {
    slug: "salary-calculator",
    name: "Salary Calculator",
    category: "calculators",
    tagline: "Convert between hourly, weekly and annual pay.",
    description:
      "Convert an hourly rate into weekly, monthly and yearly pay — or work backwards from a salary to your effective hourly rate.",
    keywords: ["salary calculator", "hourly to annual salary", "pay calculator"],
    addedAt: "2024-01-22",
    about:
      "Job offers are quoted in different units: an hourly rate for shift work, a monthly figure for many contracts, an annual package for salaried roles. This calculator puts them all on the same footing so you can compare offers honestly.",
    formula: "Annual = Hourly rate × Hours per week × Weeks per year",
    howTo: [
      "Enter your pay amount and choose whether it is hourly, monthly or yearly.",
      "Adjust hours per week and paid weeks per year if they differ from the defaults.",
      "Press Calculate to see the full breakdown.",
    ],
    example:
      "25 per hour × 38 hours × 52 weeks = 49,400 a year, or roughly 4,116 a month before deductions.",
    faqs: [
      {
        q: "Does this deduct tax?",
        a: "No — these are gross figures before income tax, pension or insurance, because deductions differ by country and personal circumstances.",
      },
      {
        q: "How many working weeks should I use?",
        a: "52 covers the whole year including paid leave. Use 48 if you want to exclude four unpaid weeks.",
      },
    ],
    related: ["profit-calculator", "percentage-calculator"],
    engine: {
      kind: "calc",
      fields: [
        { name: "amount", label: "Pay amount", placeholder: "25" },
        {
          name: "basis",
          label: "Paid",
          type: "select",
          defaultValue: "hour",
          options: [
            { value: "hour", label: "Per hour" },
            { value: "day", label: "Per day" },
            { value: "week", label: "Per week" },
            { value: "month", label: "Per month" },
            { value: "year", label: "Per year" },
          ],
        },
        { name: "hours", label: "Hours per week", defaultValue: "38" },
        { name: "weeks", label: "Paid weeks per year", defaultValue: "52" },
      ],
      compute: (v) => {
        const amount = n(v["amount"]);
        const hours = n(v["hours"] || "38");
        const weeks = n(v["weeks"] || "52");
        if (Number.isNaN(amount) || amount <= 0) return { error: "Enter a pay amount." };
        if (Number.isNaN(hours) || hours <= 0 || Number.isNaN(weeks) || weeks <= 0)
          return { error: "Hours and weeks must be greater than zero." };
        const basis = v["basis"] || "hour";
        const perYear =
          basis === "hour"
            ? amount * hours * weeks
            : basis === "day"
              ? amount * (hours / 8) * weeks
              : basis === "week"
                ? amount * weeks
                : basis === "month"
                  ? amount * 12
                  : amount;
        const perHour = perYear / (hours * weeks);
        return {
          label: "Gross yearly pay",
          value: money(perYear),
          notes: [
            `Per month: ${money(perYear / 12)}`,
            `Per week: ${money(perYear / weeks)}`,
            `Per hour: ${money(perHour)}`,
            "Figures are gross — before tax and other deductions.",
          ],
        };
      },
    },
  },
  {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    category: "calculators",
    tagline: "Credit-weighted grade point average.",
    description:
      "Calculate your semester GPA on a 4.0 scale by entering each course grade and its credit hours. Add as many courses as you need.",
    keywords: ["gpa calculator", "grade point average", "college gpa"],
    popular: true,
    addedAt: "2024-01-18",
    about:
      "GPA is a credit-weighted average: a five-credit course moves your average far more than a one-credit elective. Enter each course with its grade points and credits to see exactly where your semester stands.",
    formula: "GPA = Σ (Grade points × Credits) ÷ Σ Credits",
    howTo: [
      "Add a row for each course this semester.",
      "Enter the grade points (for example 4.0 for an A) and the credit hours.",
      "The GPA updates as you type — press Reset to start a new semester.",
    ],
    example:
      "Three courses — A (4.0, 3 credits), B+ (3.3, 4 credits) and B (3.0, 2 credits) — give (12 + 13.2 + 6) ÷ 9 = 3.47.",
    faqs: [
      {
        q: "What grade points should I use?",
        a: "Most US institutions use A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0 and so on. Always check your own institution's scale.",
      },
      {
        q: "Do pass/fail courses count?",
        a: "Usually not. Leave them out unless your school assigns them grade points.",
      },
    ],
    related: ["cgpa-calculator", "grade-calculator", "percentage-calculator"],
    engine: { kind: "grades", variant: "gpa" },
  },
  {
    slug: "cgpa-calculator",
    name: "CGPA Calculator",
    category: "calculators",
    tagline: "Combine semester GPAs into one figure.",
    description:
      "Calculate your cumulative grade point average (CGPA) by combining each semester's GPA with its credit hours.",
    keywords: ["cgpa calculator", "cumulative gpa", "overall gpa"],
    addedAt: "2024-02-02",
    about:
      "CGPA rolls every completed semester into a single number, weighted by how many credits each semester carried. It is the figure most transcripts, scholarships and graduate applications ask for.",
    formula: "CGPA = Σ (Semester GPA × Semester credits) ÷ Σ Semester credits",
    howTo: [
      "Add one row per semester you have completed.",
      "Enter that semester's GPA and the total credits it carried.",
      "Read the cumulative average at the top of the result panel.",
    ],
    example:
      "Semester 1 (3.6 GPA, 15 credits) and semester 2 (3.2 GPA, 18 credits) give (54 + 57.6) ÷ 33 = 3.38 CGPA.",
    faqs: [
      {
        q: "Can I convert CGPA to a percentage?",
        a: "Conversion formulas vary by institution — a common approximation on a 4.0 scale is CGPA × 25, but always use your university's official table.",
      },
      {
        q: "Should I include failed or repeated courses?",
        a: "Follow your institution's policy. Some replace the original grade, others average both attempts.",
      },
    ],
    related: ["gpa-calculator", "grade-calculator", "percentage-calculator"],
    engine: { kind: "grades", variant: "cgpa" },
  },
  {
    slug: "grade-calculator",
    name: "Grade Calculator",
    category: "calculators",
    tagline: "Weighted course grade from assignments.",
    description:
      "Work out your overall course grade from assignment scores and their weightings, and see how much weight is still unmarked.",
    keywords: ["grade calculator", "weighted grade calculator", "final grade"],
    addedAt: "2024-02-05",
    about:
      "Most courses weight coursework, midterms and finals differently. This calculator multiplies each score by its weight so you can see your true standing — and how much is still up for grabs before the final exam.",
    formula: "Grade = Σ (Score % × Weight) ÷ Σ Weight",
    howTo: [
      "Add a row per assessment with the score you achieved as a percentage.",
      "Enter the weight of each assessment (they do not need to add up to 100).",
      "Read your weighted grade and the share of the course still unmarked.",
    ],
    example:
      "Coursework 82% (weight 40) and midterm 74% (weight 20) give (3,280 + 1,480) ÷ 60 = 79.3% so far, with 40% of the course still to be graded.",
    faqs: [
      {
        q: "What if my weights do not add up to 100?",
        a: "The calculator normalises by the weights you entered, so the result is your grade for the work marked so far.",
      },
      {
        q: "Can I use letter grades?",
        a: "Convert them to percentages first, or use the GPA calculator if your institution grades on points.",
      },
    ],
    related: ["gpa-calculator", "cgpa-calculator", "percentage-calculator"],
    engine: { kind: "grades", variant: "grade" },
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    category: "calculators",
    tagline: "Body mass index in metric or imperial.",
    description:
      "Calculate body mass index (BMI) from height and weight in metric or imperial units, with the standard adult BMI ranges explained.",
    keywords: ["bmi calculator", "body mass index", "bmi chart"],
    addedAt: "2024-02-08",
    disclaimer:
      "This BMI calculator is for general information only. BMI is a rough population-level screening measure and does not account for muscle mass, body composition, age, pregnancy or ethnicity. It is not medical advice or a diagnosis — please speak to a qualified healthcare professional about your health.",
    about:
      "Body mass index compares weight to the square of height, producing a single number used widely for population screening. It is a starting point for a conversation, not a verdict: athletes with high muscle mass and older adults with lower bone density are both commonly misclassified.",
    formula: "BMI = Weight (kg) ÷ Height (m)²",
    howTo: [
      "Choose metric or imperial units.",
      "Enter your height and weight.",
      "Press Calculate to see your BMI and the standard adult range it falls in.",
    ],
    example:
      "A person 1.75 m tall weighing 72 kg has a BMI of 72 ÷ (1.75 × 1.75) = 23.5, inside the standard 18.5–24.9 range.",
    faqs: [
      {
        q: "What are the standard adult BMI ranges?",
        a: "Under 18.5 is classed as underweight, 18.5–24.9 as a healthy range, 25–29.9 as overweight and 30 or above as obese, for adults aged 20 and over.",
      },
      {
        q: "Is BMI accurate for everyone?",
        a: "No. It ignores body composition and does not apply in the same way to children, pregnant people or highly muscular individuals.",
      },
    ],
    related: ["age-calculator", "percentage-calculator", "weight-converter"],
    engine: {
      kind: "calc",
      fields: [
        {
          name: "units",
          label: "Units",
          type: "select",
          defaultValue: "metric",
          options: [
            { value: "metric", label: "Metric (cm / kg)" },
            { value: "imperial", label: "Imperial (in / lb)" },
          ],
        },
        { name: "height", label: "Height", placeholder: "175", hint: "cm for metric, inches for imperial" },
        { name: "weight", label: "Weight", placeholder: "72", hint: "kg for metric, pounds for imperial" },
      ],
      compute: (v) => {
        const h = n(v["height"]);
        const w = n(v["weight"]);
        if (Number.isNaN(h) || Number.isNaN(w) || h <= 0 || w <= 0)
          return { error: "Enter a valid height and weight." };
        const metres = (v["units"] === "imperial" ? h * 2.54 : h) / 100;
        const kg = v["units"] === "imperial" ? w * 0.45359237 : w;
        const bmi = kg / (metres * metres);
        const band =
          bmi < 18.5
            ? "Underweight range"
            : bmi < 25
              ? "Healthy range"
              : bmi < 30
                ? "Overweight range"
                : "Obese range";
        return {
          label: "Body mass index",
          value: fmt(bmi, 1),
          notes: [
            `Standard adult classification: ${band}`,
            `Healthy-range weight for this height: ${fmt(18.5 * metres * metres, 1)}–${fmt(24.9 * metres * metres, 1)} kg`,
            "Informational only — not medical advice.",
          ],
        };
      },
    },
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    category: "calculators",
    tagline: "Add or subtract hours and minutes.",
    description:
      "Add or subtract hours, minutes and seconds and see the total in mixed units and decimal hours — ideal for timesheets.",
    keywords: ["time calculator", "add hours and minutes", "timesheet calculator"],
    addedAt: "2024-02-12",
    about:
      "Time arithmetic is awkward because minutes roll over at 60, not 100. This calculator handles the carrying for you and also gives the decimal-hour figure that payroll and invoicing systems expect.",
    formula: "Total seconds = (h × 3600) + (m × 60) + s, then reformatted",
    howTo: [
      "Enter the first duration in hours, minutes and seconds.",
      "Enter the second duration and choose add or subtract.",
      "Press Calculate for the total in both mixed and decimal form.",
    ],
    example:
      "7h 45m plus 2h 30m is 10h 15m, which payroll would read as 10.25 hours.",
    faqs: [
      {
        q: "How do I convert minutes to decimal hours?",
        a: "Divide the minutes by 60. 45 minutes is 45 ÷ 60 = 0.75 hours.",
      },
      {
        q: "Can the result be negative?",
        a: "Yes. If you subtract a longer duration the result is shown as a negative duration.",
      },
    ],
    related: ["date-difference-calculator", "age-calculator", "time-converter"],
    engine: {
      kind: "calc",
      fields: [
        { name: "h1", label: "Hours (first)", defaultValue: "7" },
        { name: "m1", label: "Minutes (first)", defaultValue: "45" },
        {
          name: "op",
          label: "Operation",
          type: "select",
          defaultValue: "add",
          options: [
            { value: "add", label: "Add" },
            { value: "sub", label: "Subtract" },
          ],
        },
        { name: "h2", label: "Hours (second)", defaultValue: "2" },
        { name: "m2", label: "Minutes (second)", defaultValue: "30" },
      ],
      compute: (v) => {
        const [h1 = 0, m1 = 0, h2 = 0, m2 = 0] = [v["h1"], v["m1"], v["h2"], v["m2"]].map((x) =>
          x ? n(x) : 0,
        );
        if ([h1, m1, h2, m2].some(Number.isNaN)) return { error: "Enter numbers only." };
        const first = h1 * 60 + m1;
        const second = h2 * 60 + m2;
        const total = v["op"] === "sub" ? first - second : first + second;
        const sign = total < 0 ? "−" : "";
        const abs = Math.abs(total);
        return {
          label: "Total duration",
          value: `${sign}${Math.floor(abs / 60)}h ${Math.round(abs % 60)}m`,
          notes: [
            `Decimal hours: ${sign}${fmt(abs / 60, 2)}`,
            `Total minutes: ${sign}${fmt(abs, 0)}`,
          ],
        };
      },
    },
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    category: "calculators",
    tagline: "Days between two dates, with weekdays.",
    description:
      "Count the days, weeks, months and working days between two dates — useful for deadlines, notice periods and project planning.",
    keywords: ["date difference calculator", "days between dates", "date duration"],
    addedAt: "2024-02-15",
    about:
      "Counting days by hand across month boundaries is error-prone. This calculator walks the real calendar, including leap years, and separates total days from working days so you can plan around weekends.",
    howTo: [
      "Pick the start date.",
      "Pick the end date.",
      "Press Calculate to see total days, weeks, months and weekdays.",
    ],
    example:
      "From 1 March 2026 to 15 August 2026 is 167 days — about 23.9 weeks, or 119 weekdays.",
    faqs: [
      {
        q: "Is the end date included?",
        a: "No — the result is the number of nights between the dates. Add one if you need to count both endpoints inclusively.",
      },
      {
        q: "Are public holidays excluded from working days?",
        a: "Only weekends are excluded. Public holidays vary by country, so subtract them yourself.",
      },
    ],
    related: ["age-calculator", "time-calculator", "time-converter"],
    engine: {
      kind: "calc",
      fields: [
        { name: "start", label: "Start date", type: "date" },
        { name: "end", label: "End date", type: "date" },
      ],
      compute: (v) => {
        if (!v["start"] || !v["end"]) return { error: "Choose both dates." };
        const a = new Date(`${v["start"]}T00:00:00`);
        const b = new Date(`${v["end"]}T00:00:00`);
        if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()))
          return { error: "Please enter valid dates." };
        const days = Math.abs(daysBetween(a, b));
        const from = a < b ? a : b;
        let weekdays = 0;
        for (let i = 0; i < days; i++) {
          const d = new Date(from.getTime() + i * 86_400_000);
          const day = d.getDay();
          if (day !== 0 && day !== 6) weekdays++;
        }
        return {
          label: "Difference",
          value: `${days.toLocaleString()} days`,
          notes: [
            `Weeks: ${fmt(days / 7, 2)}`,
            `Approximate months: ${fmt(days / 30.4375, 2)}`,
            `Weekdays (Mon–Fri): ${weekdays.toLocaleString()}`,
          ],
        };
      },
    },
  },
];
