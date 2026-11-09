"use client";

import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AdminApplication } from "@/redux/features/admin/adminApi";

import { useOptionLabel } from "../_lib/useOptionLabel";

interface ApplicationDetailsDialogProps {
  application: AdminApplication | null;
  onClose: () => void;
}

interface DetailRow {
  label: string;
  value?: string | null;
}

const ApplicationDetailsDialog = ({ application, onClose }: ApplicationDetailsDialogProps) => {
  const t = useTranslations("Admin.details");
  const optionLabel = useOptionLabel();
  const format = useFormatter();

  const sections = application
    ? [
        {
          title: t("sections.portal"),
          rows: [
            {
              label: t("fields.fullName"),
              value: application.applicationPortal.fullName,
            },
            {
              label: t("fields.email"),
              value: application.applicationPortal.email,
            },
            {
              label: t("fields.program"),
              value: optionLabel("program", application.applicationPortal.program),
            },
            {
              label: t("fields.cohort"),
              value:
                application.applicationPortal.cohort && optionLabel("cohort", application.applicationPortal.cohort),
            },
            {
              label: t("fields.submitted"),
              value: format.dateTime(new Date(application.createdAt), {
                dateStyle: "medium",
                timeStyle: "short",
              }),
            },
          ],
        },
        {
          title: t("sections.personal"),
          rows: [
            { label: t("fields.title"), value: application.personalInfo.title },
            {
              label: t("fields.surname"),
              value: application.personalInfo.surname,
            },
            {
              label: t("fields.firstName"),
              value: application.personalInfo.firstName,
            },
            {
              label: t("fields.businessName"),
              value: application.personalInfo.businessName,
            },
            {
              label: t("fields.dateOfBirth"),
              value: format.dateTime(new Date(application.personalInfo.dateOfBirth), { dateStyle: "long" }),
            },
            {
              label: t("fields.gender"),
              value: optionLabel("gender", application.personalInfo.gender),
            },
          ],
        },
        {
          title: t("sections.business"),
          rows: [
            {
              label: t("fields.businessDescription"),
              value: application.businessBasics.businessDescription,
            },
            {
              label: t("fields.operatingDuration"),
              value: optionLabel("operatingDuration", application.businessBasics.operatingDuration),
            },
            {
              label: t("fields.averageRevenue"),
              value: optionLabel("averageRevenue", application.businessBasics.averageRevenue),
            },
            {
              label: t("fields.fullTimeCommitment"),
              value: optionLabel("fullTimeCommitment", application.businessBasics.fullTimeCommitment),
            },
          ],
        },
        {
          title: t("sections.who"),
          rows: [
            {
              label: t("fields.challengeAndSkillGap"),
              value: application.whoYouAre.challengeAndSkillGap,
            },
            {
              label: t("fields.cohortMotivation"),
              value: application.whoYouAre.cohortMotivation,
            },
          ],
        },
        {
          title: t("sections.accessibility"),
          rows: [
            {
              label: t("fields.hasAccessibilityNeeds"),
              value: optionLabel("hasAccessibilityNeeds", application.accessibilitySupport.hasAccessibilityNeeds),
            },
            {
              label: t("fields.accessibilityNeed"),
              value:
                application.accessibilitySupport.accessibilityNeed &&
                optionLabel("accessibilityNeed", application.accessibilitySupport.accessibilityNeed),
            },
            {
              label: t("fields.accessibilityNotes"),
              value: application.accessibilitySupport.accessibilityNotes,
            },
          ],
        },
      ]
    : [];

  return (
    <Dialog open={application !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-y-auto p-5 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-bold text-primary">{t("title")}</DialogTitle>
          <DialogDescription>{application?.applicationPortal.fullName}</DialogDescription>
        </DialogHeader>

        {application?.submit?.passportPhotoUrl && (
          <Image
            src={application.submit?.passportPhotoUrl}
            alt={t("photoAlt", {
              name: application.applicationPortal.fullName,
            })}
            width={96}
            height={96}
            unoptimized
            className="size-24 rounded-xl object-cover"
          />
        )}

        {sections.map((section) => (
          <section key={section.title}>
            <h3 className="font-serif text-base font-bold text-primary">{section.title}</h3>
            <dl className="mt-2 divide-y divide-border rounded-xl bg-field">
              {section.rows.map((row: DetailRow) => (
                <div key={row.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[1fr_2fr] sm:gap-4">
                  <dt className="text-sm font-semibold text-primary">{row.label}</dt>
                  <dd className="text-sm break-words whitespace-pre-wrap text-muted-foreground">
                    {row.value || t("notProvided")}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
