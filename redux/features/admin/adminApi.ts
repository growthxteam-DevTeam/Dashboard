import { apiSlice } from "../api/apiSlice";

// One row of GET /admin/applications: the submitted details (grouped like the backend's ApplicationEntity,
// see growth-x-be README) plus where the applicant is in the flow. The backend never sends the GS code or
// password hash.
export interface AdminApplication {
  id: string;
  applicationPortal: {
    fullName: string;
    email: string;
    program: string;
    cohort?: string;
  };
  personalInfo: {
    title?: string;
    surname: string;
    firstName: string;
    businessName: string;
    dateOfBirth: string;
    gender: string;
  };
  businessBasics: {
    businessDescription: string;
    operatingDuration: string;
    averageRevenue: string;
    fullTimeCommitment: "full-time" | "not-yet";
  };
  whoYouAre: {
    challengeAndSkillGap: string;
    cohortMotivation: string;
  };
  accessibilitySupport: {
    hasAccessibilityNeeds: "yes" | "no";
    accessibilityNeed?: string;
    accessibilityNotes?: string;
  };
  // Absent on records saved without a passport photo.
  submit?: {
    passportPhotoUrl?: string;
  };
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
  /** When the last invite email went out; null if none has. */
  invitedAt: string | null;
  /** True once the applicant has used their GS code to set a password. */
  hasAccount: boolean;
}

export const ADMIN_APPLICATIONS_PAGE_SIZE = 10;

interface AdminApplicationsResponse {
  status: string;
  statusCode: number;
  data: AdminApplication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApplicantActionResponse {
  status: string;
  statusCode: number;
  message: string;
  data: AdminApplication;
}

export const adminApi = apiSlice.enhanceEndpoints({ addTagTypes: ["AdminApplications"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAdminApplications: builder.query<AdminApplicationsResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: "/admin/applications",
        params: { page, limit },
      }),
      providesTags: ["AdminApplications"],
    }),

    inviteApplicant: builder.mutation<ApplicantActionResponse, string>({
      query: (id) => ({
        url: `/admin/applications/${id}/invite`,
        method: "POST",
      }),
      invalidatesTags: ["AdminApplications"],
    }),

    // Emails the applicant a rejection and marks the application rejected.
    rejectApplicant: builder.mutation<ApplicantActionResponse, string>({
      query: (id) => ({
        url: `/admin/applications/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["AdminApplications"],
    }),
  }),
});

export const {
  useGetAdminApplicationsQuery,
  useInviteApplicantMutation,
  useRejectApplicantMutation,
} = adminApi;
