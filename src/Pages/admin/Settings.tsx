import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const renderSettings = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold">Settings</h2>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Maintenance Mode</div>
              <div className="text-sm text-gray-500">
                Enable maintenance mode
              </div>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Auto Deposits</div>
              <div className="text-sm text-gray-500">
                Automatically approve deposits
              </div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">
                Send email notifications
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-gray-500">
                Enable 2FA for admin accounts
              </div>
            </div>
            <Button variant="outline" size="sm">
              Setup
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Session Timeout</div>
              <div className="text-sm text-gray-500">
                Auto logout after inactivity
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Password Policy</div>
              <div className="text-sm text-gray-500">
                Set password requirements
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Referral Commission</div>
              <div className="text-sm text-gray-500">Current rate: 5.5%</div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Investment Bonus</div>
              <div className="text-sm text-gray-500">
                Bonus percentage for investments
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">System Version</div>
              <div className="text-sm text-gray-500">v2.1.4</div>
            </div>
            <Button variant="outline" size="sm">
              Check Updates
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">Database Backup</div>
              <div className="text-sm text-gray-500">
                Last backup: 2 hours ago
              </div>
            </div>
            <Button variant="outline" size="sm">
              Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
