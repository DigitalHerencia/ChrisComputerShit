import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

interface PayrollTableProps {
  data: {
    name: string
    regularHours: number
    overtimeHours: number
    totalHours: number
    regularPay: number
    overtimePay: number
    totalPay: number
    entries: number
  }[]
}

export function PayrollTable({ data }: PayrollTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Employee Payroll Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Employee</th>
                <th className="text-right py-3 px-4 font-medium">Regular Hours</th>
                <th className="text-right py-3 px-4 font-medium">OT Hours</th>
                <th className="text-right py-3 px-4 font-medium">Total Hours</th>
                <th className="text-right py-3 px-4 font-medium">Regular Pay</th>
                <th className="text-right py-3 px-4 font-medium">OT Pay</th>
                <th className="text-right py-3 px-4 font-medium">Total Pay</th>
                <th className="text-right py-3 px-4 font-medium">Entries</th>
              </tr>
            </thead>
            <tbody>
              {data.map((employee) => (
                <tr key={employee.name} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{employee.name}</td>
                  <td className="text-right py-3 px-4">{employee.regularHours.toFixed(1)}</td>
                  <td className="text-right py-3 px-4">{employee.overtimeHours.toFixed(1)}</td>
                  <td className="text-right py-3 px-4 font-medium">{employee.totalHours.toFixed(1)}</td>
                  <td className="text-right py-3 px-4">${employee.regularPay.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">${employee.overtimePay.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 font-bold">${employee.totalPay.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{employee.entries}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-bold">
                <td className="py-3 px-4">TOTALS</td>
                <td className="text-right py-3 px-4">
                  {data.reduce((sum, emp) => sum + emp.regularHours, 0).toFixed(1)}
                </td>
                <td className="text-right py-3 px-4">
                  {data.reduce((sum, emp) => sum + emp.overtimeHours, 0).toFixed(1)}
                </td>
                <td className="text-right py-3 px-4">
                  {data.reduce((sum, emp) => sum + emp.totalHours, 0).toFixed(1)}
                </td>
                <td className="text-right py-3 px-4">
                  ${data.reduce((sum, emp) => sum + emp.regularPay, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">
                  ${data.reduce((sum, emp) => sum + emp.overtimePay, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">
                  ${data.reduce((sum, emp) => sum + emp.totalPay, 0).toLocaleString()}
                </td>
                <td className="text-right py-3 px-4">{data.reduce((sum, emp) => sum + emp.entries, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
