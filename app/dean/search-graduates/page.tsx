"use client"

import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

export default function DeanSearchGraduatesPage() {
  // Redirect to admin search page - same functionality
  redirect(ROUTES.ADMIN.SEARCH_GRADUATES)
}
