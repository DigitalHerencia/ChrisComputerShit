import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Users } from 'lucide-react';

interface PayrollSummaryProps {
  timeEntries: {
    id: string;
    hoursWorked: number;
    overtime: number;
    user: { firstName: string | null; lastName: string | null };
  }[];
}

export function PayrollSummary({ timeEntries }: PayrollSummaryProps) {
  // Group by user
  const userHours = timeEntries.reduce(
    (acc, entry) => {
      const userName =
        `${entry.user.firstName || ''} ${entry.user.lastName || ''}`.trim();
      if (!acc[userName]) {
        acc[userName] = { regular: 0, overtime: 0 };
      }
      acc[userName].regular += entry.hoursWorked;
      acc[userName].overtime += entry.overtime;
      return acc;
    },
    {} as Record<string, { regular: number; overtime: number }>
  );

  const totalRegular = timeEntries.reduce(
    (sum, entry) => sum + entry.hoursWorked,
    0
  );
  const totalOvertime = timeEntries.reduce(
    (sum, entry) => sum + entry.overtime,
    0
  );
  const totalHours = totalRegular + totalOvertime;

  // Estimated payroll (using placeholder rates)
  const regularRate = 25; // $25/hour
  const overtimeRate = 37.5; // $37.50/hour (1.5x)
  const estimatedPayroll =
    totalRegular * regularRate + totalOvertime * overtimeRate;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Weekly Payroll Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary bg-primary/10 rounded-lg p-2" />
            <div>
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-secondary bg-secondary/10 rounded-lg p-2" />
            <div>
              <p className="text-2xl font-bold">
                {Object.keys(userHours).length}
              </p>
              <p className="text-sm text-muted-foreground">Employees</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-accent bg-accent/10 rounded-lg p-2" />
            <div>
              <p className="text-2xl font-bold">
                ${estimatedPayroll.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Est. Payroll</p>
            </div>
          </div>
        </div>

        {Object.keys(userHours).length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Employee Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(userHours).map(([userName, hours]) => (
                <div
                  key={userName}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="font-medium">{userName}</span>
                  <div className="text-right">
                    <p className="font-medium">
                      {(hours.regular + hours.overtime).toFixed(1)}h total
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hours.regular}h regular
                      {hours.overtime > 0 && ` + ${hours.overtime}h OT`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
