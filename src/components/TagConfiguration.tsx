
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagConfigurationProps {
  tagInfo: any;
  isConnected: boolean;
}

const TagConfiguration: React.FC<TagConfigurationProps> = ({ tagInfo, isConnected }) => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    url: 'https://example.com/tag',
    recordType: 'url',
    textData: '',
    enableCounter: false,
    counterValue: 0,
    readOnlyMode: false,
    maxReads: 0,
    enableTamperDetection: true
  });
  const [isWriting, setIsWriting] = useState(false);

  const handleSave = async () => {
    if (!isConnected) {
      toast({
        title: "No tag connected",
        description: "Please connect to an NFC tag first",
        variant: "destructive"
      });
      return;
    }

    setIsWriting(true);
    
    // Simulate writing to tag
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Configuration saved",
        description: "Tag has been successfully programmed",
      });
    } catch (error) {
      toast({
        title: "Write failed",
        description: "Failed to write configuration to tag",
        variant: "destructive"
      });
    } finally {
      setIsWriting(false);
    }
  };

  const handleReset = () => {
    setConfig({
      url: 'https://example.com/tag',
      recordType: 'url',
      textData: '',
      enableCounter: false,
      counterValue: 0,
      readOnlyMode: false,
      maxReads: 0,
      enableTamperDetection: true
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5 text-blue-400" />
            Tag Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected && (
            <div className="p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
              <p className="text-yellow-200 text-sm">
                Connect to an NFC tag to enable configuration options
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="recordType" className="text-slate-300">Record Type</Label>
                <Select 
                  value={config.recordType} 
                  onValueChange={(value) => setConfig({...config, recordType: value})}
                  disabled={!isConnected}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="url">URL Record</SelectItem>
                    <SelectItem value="text">Text Record</SelectItem>
                    <SelectItem value="mime">MIME Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.recordType === 'url' && (
                <div>
                  <Label htmlFor="url" className="text-slate-300">URL</Label>
                  <Input
                    id="url"
                    value={config.url}
                    onChange={(e) => setConfig({...config, url: e.target.value})}
                    placeholder="https://example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={!isConnected}
                  />
                </div>
              )}

              {config.recordType === 'text' && (
                <div>
                  <Label htmlFor="textData" className="text-slate-300">Text Data</Label>
                  <Textarea
                    id="textData"
                    value={config.textData}
                    onChange={(e) => setConfig({...config, textData: e.target.value})}
                    placeholder="Enter text data..."
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={!isConnected}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="counterValue" className="text-slate-300">Counter Value</Label>
                <Input
                  id="counterValue"
                  type="number"
                  value={config.counterValue}
                  onChange={(e) => setConfig({...config, counterValue: parseInt(e.target.value) || 0})}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>

              <div>
                <Label htmlFor="maxReads" className="text-slate-300">Max Reads (0 = unlimited)</Label>
                <Input
                  id="maxReads"
                  type="number"
                  value={config.maxReads}
                  onChange={(e) => setConfig({...config, maxReads: parseInt(e.target.value) || 0})}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Enable Counter</Label>
                  <p className="text-xs text-slate-400">Track read count</p>
                </div>
                <Switch
                  checked={config.enableCounter}
                  onCheckedChange={(checked) => setConfig({...config, enableCounter: checked})}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Read Only Mode</Label>
                  <p className="text-xs text-slate-400">Prevent further writes</p>
                </div>
                <Switch
                  checked={config.readOnlyMode}
                  onCheckedChange={(checked) => setConfig({...config, readOnlyMode: checked})}
                  disabled={!isConnected}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                <div>
                  <Label className="text-slate-300">Tamper Detection</Label>
                  <p className="text-xs text-slate-400">Detect physical tampering</p>
                </div>
                <Switch
                  checked={config.enableTamperDetection}
                  onCheckedChange={(checked) => setConfig({...config, enableTamperDetection: checked})}
                  disabled={!isConnected}
                />
              </div>

              {tagInfo && (
                <div className="p-3 bg-slate-900 rounded-lg">
                  <Label className="text-slate-300 mb-2 block">Current Status</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      Memory: {tagInfo.memory}
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      Version: {tagInfo.version}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button 
              onClick={handleSave}
              disabled={!isConnected || isWriting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isWriting ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Writing...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Write to Tag
                </>
              )}
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagConfiguration;
