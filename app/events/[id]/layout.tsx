import styles from './styles.module.css'
 
export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}