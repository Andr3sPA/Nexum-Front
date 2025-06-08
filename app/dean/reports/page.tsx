"use client"

import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function DeanReportsPage() {
  // Redirect to admin reports page - same functionality
  redirect(ROUTES.ADMIN.REPORTS)
}
