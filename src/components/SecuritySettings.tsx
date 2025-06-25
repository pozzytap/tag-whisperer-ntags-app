
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Key, Lock, Unlock, AlertTriangle, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecuritySettingsProps {
  tagInfo: any;
  isConnected: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ tagInfo, isConnected }) => {
  const { toast } = useToast();
  const [security, setSecurity] = useState({
    authenticationEnabled: true,
    encryptionEnabled: true,
    password: '',
    confirmPassword: '',
    keyDerivation: 'pbkdf2',
    iterations: 10000,
    enableAntiCloning: true,
    tamperResistance: true,
    accessControl: 'authenticated',
    sessionTimeout: 300
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplySecurity = async () => {
    if (!isConnected) {
      toast({
        title: "No tag connected",
        description: "Please connect to an NFC tag first",
        variant: "destructive"
      });
      return;
    }

    if (security.password !== security.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (security.password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      toast({
        title: "Security applied",
        description: "Security settings have been configured successfully",
      });
    } catch (error) {
      toast({
        title: "Security configuration failed",
        description: "Failed to apply security settings",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const getSecurityLevel = () => {
    let level = 0;
    if (security.authenticationEnabled) level++;
    if (security.encryptionEnabled) level++;
    if (security.enableAntiCloning) level++;
    if (security.tamperResistance) level++;
    if (security.password.length >= 8) level++;
    
    if (level >= 4) return { text: 'High', color: 'bg-green-600' };
    if (level >= 2) return { text: 'Medium', color: 'bg-yellow-600' };
    return { text: 'Low', color: 'bg-red-600' };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Security Settings
            </div>
            <Badge className={`${securityLevel.color} hover:${securityLevel.color}`}>
              {securityLevel.text} Security
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected && (
            <Alert className="bg-yellow-900 border-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-200">
                Connect to an NFC tag to configure security settings
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Authentication</Label>
                  <p className="text-xs text-slate-400">Require authentication for access</p>
                </div>
                <Switch
                  checked={security.authenticationEnabled}
                  onCheckedChange={(checked) => setSecurity({...security, authenticationEnabled: checked})}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Encryption</Label>
                  <p className="text-xs text-slate-400">Encrypt stored data</p>
                </div>
                <Switch
                  checked={security.encryptionEnabled}
                  onCheckedChange={(checked) => setSecurity({...security, encryptionEnabled: checked})}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Anti-Cloning</Label>
                  <p className="text-xs text-slate-400">Prevent unauthorized duplication</p>
                </div>
                <Switch
                  checked={security.enableAntiCloning}
                  onCheckedChange={(checked) => setSecurity({...security, enableAntiCloning: checked})}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Tamper Resistance</Label>
                  <p className="text-xs text-slate-400">Detect physical tampering</p>
                </div>
                <Switch
                  checked={security.tamperResistance}
                  onCheckedChange={(checked) => setSecurity({...security, tamperResistance: checked})}
                  disabled={!isConnected}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-slate-300 flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPasswords ? "text" : "password"}
                  value={security.password}
                  onChange={(e) => setSecurity({...security, password: e.target.value})}
                  placeholder="Enter secure password"
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPasswords ? "text" : "password"}
                  value={security.confirmPassword}
                  onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
                  placeholder="Confirm password"
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={showPasswords}
                  onCheckedChange={setShowPasswords}
                  disabled={!isConnected}
                />
                <Label className="text-slate-300 text-sm">Show passwords</Label>
              </div>

              <div>
                <Label htmlFor="keyDerivation" className="text-slate-300">Key Derivation</Label>
                <Select 
                  value={security.keyDerivation} 
                  onValueChange={(value) => setSecurity({...security, keyDerivation: value})}
                  disabled={!isConnected}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pbkdf2">PBKDF2</SelectItem>
                    <SelectItem value="scrypt">Scrypt</SelectItem>
                    <SelectItem value="argon2">Argon2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="iterations" className="text-slate-300">Iterations</Label>
                <Input
                  id="iterations"
                  type="number"
                  value={security.iterations}
                  onChange={(e) => setSecurity({...security, iterations: parseInt(e.target.value) || 10000})}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accessControl" className="text-slate-300">Access Control</Label>
              <Select 
                value={security.accessControl} 
                onValueChange={(value) => setSecurity({...security, accessControl: value})}
                disabled={!isConnected}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open Access</SelectItem>
                  <SelectItem value="authenticated">Authenticated Only</SelectItem>
                  <SelectItem value="encrypted">Encrypted Only</SelectItem>
                  <SelectItem value="both">Both Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sessionTimeout" className="text-slate-300">Session Timeout (seconds)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value) || 300})}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={!isConnected}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              {security.authenticationEnabled && security.encryptionEnabled ? (
                <Lock className="h-4 w-4 text-green-400" />
              ) : (
                <Unlock className="h-4 w-4 text-yellow-400" />
              )}
              <span className="text-sm text-slate-300">
                Security Level: {securityLevel.text}
              </span>
            </div>

            <Button 
              onClick={handleApplySecurity}
              disabled={!isConnected || isApplying}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isApplying ? (
                <>
                  <Shield className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Apply Security
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
