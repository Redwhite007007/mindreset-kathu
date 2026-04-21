/**
 * Appendix B — South African support resources.
 * All phone numbers and copy are verbatim from the PDF.
 */

export type Helpline = {
  name: string;
  phone: string;
  sms?: string;
  description: string;
  scope: "national" | "local";
};

export const HELPLINES: readonly Helpline[] = [
  {
    name: "SADAG — South African Depression and Anxiety Group",
    phone: "0800567567",
    sms: "31393",
    description:
      "Toll-free, 24 hours. Staffed by trained counsellors. Depression, anxiety, suicidal thoughts, general mental health support. You do not have to be in crisis to call — you can call simply to talk to someone.",
    scope: "national",
  },
  {
    name: "Lifeline South Africa",
    phone: "0861322322",
    description: "Trauma counselling, crisis support, and general emotional support. Available nationally.",
    scope: "national",
  },
  {
    name: "Childline South Africa",
    phone: "0800055555",
    description:
      "Toll-free, 24 hours. For children and teenagers. If you are experiencing abuse, family violence, or are in danger — please call this number. Free and confidential.",
    scope: "national",
  },
  {
    name: "SANCA — SA National Council on Alcoholism & Drug Dependence",
    phone: "0118923829",
    description: "For support with substance-related issues — for yourself or someone you love.",
    scope: "national",
  },
  {
    name: "CRC Kathu Church Counselling Team",
    phone: "",
    description:
      "Speak to a youth leader, cell group leader, or pastor. You do not need to be in a crisis to reach out. Nothing shared in pastoral confidence is treated casually.",
    scope: "local",
  },
  {
    name: "Kathu Local Clinic — Mental Health Services",
    phone: "",
    description:
      "Your local government clinic can refer you to a mental health nurse or social worker. Free for South African citizens. Visit during clinic hours and ask for mental health or counselling support. There is no shame in going.",
    scope: "local",
  },
] as const;

export const SUPPORT_HEADLINE = "You Don't Have to Carry This Alone";
export const SUPPORT_BODY =
  "This series has talked honestly about stress, anxiety, emotional pain, toxic relationships, and the weight that comes from carrying things alone. Some of what you've read may have surfaced things that go deeper than a weekly challenge can address. That's not a failure. That's wisdom — recognising that some things need more than a devotional can provide. Seeking help is wisdom, not weakness. God works through both prayer and people.";
export const SUPPORT_CLOSING = "God cares for you. So do we. Please reach out.";
