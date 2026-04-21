import { Phone, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import {
  HELPLINES,
  SUPPORT_BODY,
  SUPPORT_CLOSING,
  SUPPORT_HEADLINE,
} from "@/content/appendices/support";
import { GLOSSARY_AF } from "@/content/appendices/glossary-af";

export default function SupportPage() {
  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          Support · Appendix B
        </p>
        <h1 className="text-3xl font-black tracking-tight">{SUPPORT_HEADLINE}</h1>
        <p className="text-sm leading-relaxed text-[var(--color-reboot-muted)]">{SUPPORT_BODY}</p>
      </header>

      <Alert severity="info" title="If you are in immediate danger">
        Please call Childline (0800 055 555) or SADAG (0800 567 567) now. Both are free, 24-hour,
        and confidential. You do not need a data bundle to call these numbers.
      </Alert>

      <ul className="space-y-3">
        {HELPLINES.map((h) => (
          <li key={h.name}>
            <Card>
              <h3 className="text-base font-bold">{h.name}</h3>
              {h.phone && (
                <a
                  href={`tel:${h.phone}`}
                  className="mt-1 inline-flex items-center gap-2 text-[var(--color-reboot-electric)] font-semibold"
                >
                  <Phone className="h-4 w-4" aria-hidden /> {h.phone}
                </a>
              )}
              {h.sms && (
                <a
                  href={`sms:${h.sms}`}
                  className="ml-4 inline-flex items-center gap-2 text-[var(--color-reboot-neon)] font-semibold"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden /> SMS {h.sms}
                </a>
              )}
              <p className="mt-2 text-sm text-[var(--color-reboot-muted)]">{h.description}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card>
        <h2 className="text-lg font-bold tracking-tight">Appendix C · Afrikaans glossary</h2>
        <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
          Full chapter translations available on request.
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {GLOSSARY_AF.map((row) => (
            <div key={row.en} className="rounded-xl bg-[var(--color-reboot-surface-2)] p-2">
              <dt className="font-bold">{row.en}</dt>
              <dd className="text-[var(--color-reboot-muted)]">{row.af}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <p className="text-center text-sm italic text-[var(--color-reboot-muted)]">
        {SUPPORT_CLOSING}
      </p>
    </div>
  );
}
