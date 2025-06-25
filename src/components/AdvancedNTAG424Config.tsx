
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Key, Link, Hash, Save, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NTAG424Config, ntag424Service } from '@/services/NTAG424Service';

interface AdvancedNTAG424ConfigProps {
  tagInfo: any;
  isConnected: boolean;
}

const AdvancedNTAG424Config: React.FC<AdvancedNTAG424ConfigProps> = ({ tagInfo, isConnected }) => {
  const { toast } = useToast();
  const [isWriting, setIsWriting] = useState(false);
  const [config, setConfig] = useState<NTAG424Config>({
    // SUN Configuration
    sunEnabled: false,
    sunKey: '',
    sunCounter: 0,
    sunURL: 'https://example.com/verify?sun=',
    
    // SDM Configuration
    sdmEnabled: false,
    sdmKey: '',
    sdmMacKey: '',
    sdmEncKey: '',
    sdmFileData: '',
    sdmMacOffset: 0,
    sdmEncOffset: 16,
    sdmUidOffset: 32,
    sdmCounterOffset: 39,
    
    // Advanced Settings
    authenticateFirst: true,
    virtualCardSelect: false,
    fileCommMode: 'encrypt',
    accessRights: {
      read: 'E',
      write: '0',
      readWrite: '0',
      changeAccessRights: '0'
    }
  });

  const handleWriteConfiguration = async () => {
    if (!isConnected) {
      toast({
        title: "No tag connected",
        description: "Please connect to an NTAG424 tag first",
        variant: "destructive"
      });
      return;
    }

    setIsWriting(true);
    
    try {
      await ntag424Service.writeConfiguration(config);
      
      toast({
        title: "Configuration written successfully",
        description: "NTAG424 has been programmed with SUN and SDM settings",
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: "Failed to write configuration to NTAG424",
        variant: "destructive"
      });
    } finally {
      setIsWriting(false);
    }
  };

  const generateRandomKey = (length: number = 16): string => {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < length * 2; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Advanced NTAG424 Configuration
            </div>
            <div className="flex gap-2">
              {config.sunEnabled && (
                <Badge className="bg-green-600">SUN Enabled</Badge>
              )}
              {config.sdmEnabled && (
                <Badge className="bg-blue-600">SDM Enabled</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sun" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="sun" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                SUN
              </TabsTrigger>
              <TabsTrigger value="sdm" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SDM
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sun" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Enable SUN (Secure Unique NFC)</Label>
                  <p className="text-xs text-slate-400">Generate tamper-proof unique URLs</p>
                </div>
                <Switch
                  checked={config.sunEnabled}
                  onCheckedChange={(checked) => setConfig({...config, sunEnabled: checked})}
                  disabled={!isConnected}
                />
              </div>

              {config.sunEnabled && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sunURL" className="text-slate-300">SUN Base URL</Label>
                    <Input
                      id="sunURL"
                      value={config.sunURL}
                      onChange={(e) => setConfig({...config, sunURL: e.target.value})}
                      placeholder="https://example.com/verify?sun="
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={!isConnected}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="sunKey" className="text-slate-300">SUN Key (AES-128)</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setConfig({...config, sunKey: generateRandomKey()})}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        disabled={!isConnected}
                      >
                        Generate
                      </Button>
                    </div>
                    <Input
                      id="sunKey"
                      value={config.sunKey}
                      onChange={(e) => setConfig({...config, sunKey: e.target.value})}
                      placeholder="32-character hex key"
                      className="bg-slate-700 border-slate-600 text-white font-mono"
                      disabled={!isConnected}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sunCounter" className="text-slate-300">Initial Counter Value</Label>
                    <Input
                      id="sunCounter"
                      type="number"
                      value={config.sunCounter}
                      onChange={(e) => setConfig({...config, sunCounter: parseInt(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={!isConnected}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sdm" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Enable SDM (Secure Dynamic Messaging)</Label>
                  <p className="text-xs text-slate-400">Dynamic encrypted data with MAC authentication</p>
                </div>
                <Switch
                  checked={config.sdmEnabled}
                  onCheckedChange={(checked) => setConfig({...config, sdmEnabled: checked})}
                  disabled={!isConnected}
                />
              </div>

              {config.sdmEnabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="sdmMacKey" className="text-slate-300">MAC Key</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfig({...config, sdmMacKey: generateRandomKey()})}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          disabled={!isConnected}
                        >
                          Generate
                        </Button>
                      </div>
                      <Input
                        id="sdmMacKey"
                        value={config.sdmMacKey}
                        onChange={(e) => setConfig({...config, sdmMacKey: e.target.value})}
                        placeholder="MAC key (32 hex chars)"
                        className="bg-slate-700 border-slate-600 text-white font-mono"
                        disabled={!isConnected}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="sdmEncKey" className="text-slate-300">Encryption Key</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setConfig({...config, sdmEncKey: generateRandomKey()})}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          disabled={!isConnected}
                        >
                          Generate
                        </Button>
                      </div>
                      <Input
                        id="sdmEncKey"
                        value={config.sdmEncKey}
                        onChange={(e) => setConfig({...config, sdmEncKey: e.target.value})}
                        placeholder="Encryption key (32 hex chars)"
                        className="bg-slate-700 border-slate-600 text-white font-mono"
                        disabled={!isConnected}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sdmFileData" className="text-slate-300">SDM File Template</Label>
                    <Input
                      id="sdmFileData"
                      value={config.sdmFileData}
                      onChange={(e) => setConfig({...config, sdmFileData: e.target.value})}
                      placeholder="https://example.com/sdm?mac=...&enc=...&uid=...&ctr=..."
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled={!isConnected}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="sdmMacOffset" className="text-slate-300">MAC Offset</Label>
                      <Input
                        id="sdmMacOffset"
                        type="number"
                        value={config.sdmMacOffset}
                        onChange={(e) => setConfig({...config, sdmMacOffset: parseInt(e.target.value) || 0})}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sdmEncOffset" className="text-slate-300">Enc Offset</Label>
                      <Input
                        id="sdmEncOffset"
                        type="number"
                        value={config.sdmEncOffset}
                        onChange={(e) => setConfig({...config, sdmEncOffset: parseInt(e.target.value) || 16})}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sdmUidOffset" className="text-slate-300">UID Offset</Label>
                      <Input
                        id="sdmUidOffset"
                        type="number"
                        value={config.sdmUidOffset}
                        onChange={(e) => setConfig({...config, sdmUidOffset: parseInt(e.target.value) || 32})}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sdmCounterOffset" className="text-slate-300">Counter Offset</Label>
                      <Input
                        id="sdmCounterOffset"
                        type="number"
                        value={config.sdmCounterOffset}
                        onChange={(e) => setConfig({...config, sdmCounterOffset: parseInt(e.target.value) || 39})}
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Authenticate First</Label>
                    <p className="text-xs text-slate-400">Require authentication before access</p>
                  </div>
                  <Switch
                    checked={config.authenticateFirst}
                    onCheckedChange={(checked) => setConfig({...config, authenticateFirst: checked})}
                    disabled={!isConnected}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Virtual Card Select</Label>
                    <p className="text-xs text-slate-400">Enable virtual card selection</p>
                  </div>
                  <Switch
                    checked={config.virtualCardSelect}
                    onCheckedChange={(checked) => setConfig({...config, virtualCardSelect: checked})}
                    disabled={!isConnected}
                  />
                </div>

                <div>
                  <Label htmlFor="fileCommMode" className="text-slate-300">File Communication Mode</Label>
                  <Select 
                    value={config.fileCommMode} 
                    onValueChange={(value: 'plain' | 'mac' | 'encrypt') => setConfig({...config, fileCommMode: value})}
                    disabled={!isConnected}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plain">Plain</SelectItem>
                      <SelectItem value="mac">MAC</SelectItem>
                      <SelectItem value="encrypt">Encrypt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="bg-slate-700" />

                <div>
                  <Label className="text-slate-300 mb-3 block">Access Rights Configuration</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="readAccess" className="text-slate-300 text-sm">Read Access</Label>
                      <Input
                        id="readAccess"
                        value={config.accessRights.read}
                        onChange={(e) => setConfig({
                          ...config, 
                          accessRights: {...config.accessRights, read: e.target.value}
                        })}
                        placeholder="E"
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>

                    <div>
                      <Label htmlFor="writeAccess" className="text-slate-300 text-sm">Write Access</Label>
                      <Input
                        id="writeAccess"
                        value={config.accessRights.write}
                        onChange={(e) => setConfig({
                          ...config, 
                          accessRights: {...config.accessRights, write: e.target.value}
                        })}
                        placeholder="0"
                        className="bg-slate-700 border-slate-600 text-white"
                        disabled={!isConnected}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6 border-t border-slate-700">
            <Button 
              onClick={handleWriteConfiguration}
              disabled={!isConnected || isWriting || (!config.sunEnabled && !config.sdmEnabled)}
              className="bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isWriting ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Programming...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Program NTAG424
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNTAG424Config;
