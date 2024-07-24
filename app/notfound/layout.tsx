import { PageHeader } from "@/components"
 
export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <section>
            <PageHeader title="Page Not Found"></PageHeader>
            {children}
        </section>
    )
}