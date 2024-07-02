import './styles.module.css'
 
export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}