
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, Globe, Copy, Check, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface URLMirrorProps {
  tagInfo: any;
  isConnected: boolean;
}

const URLMirror: React.FC<URLMirrorProps> = ({ tagInfo, isConnected }) => {
  const { toast } = useToast();
  const [mirror, setMirror] = useState({
    enabled: false,
    baseUrl: 'https://api.example.com/tag',
    dynamicUrl: 'https://api.example.com/tag/{uid}/{counter}',
    includeUID: true,
    includeCounter: true,
    includeTimestamp: false,
    customParameters: '',
    cacheTTL: 3600,
    enableSSL: true
  });
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePreviewUrl = () => {
    if (!tagInfo) return '';
    
    let url = mirror.baseUrl;
    
    if (mirror.includeUID) {
      url += `?uid=${tagInfo.uid}`;
    }
    
    if (mirror.includeCounter) {
      url += mirror.includeUID ? '&counter=123' : '?counter=123';
    }
    
    if (mirror.includeTimestamp) {
      const separator = mirror.includeUID || mirror.includeCounter ? '&' : '?';
      url += `${separator}timestamp=${Date.now()}`;
    }
    
    if (mirror.customParameters) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}${mirror.customParameters}`;
    }
    
    return url;
  };

  const handleConfigure = async () => {
    if (!isConnected) {
      toast({
        title: "No tag connected",
        description: "Please connect to an NFC tag first",
        variant: "destructive"
      });
      return;
    }

    setIsConfiguring(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const preview = generatePreviewUrl();
      setPreviewUrl(preview);
      
      toast({
        title: "URL Mirror configured",
        description: "Dynamic URL mirroring has been set up successfully",
      });
    } catch (error) {
      toast({
        title: "Configuration failed",
        description: "Failed to configure URL mirroring",
        variant: "destructive"
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "URL has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wifi className="h-5 w-5 text-blue-400" />
            URL Mirroring Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected && (
            <Alert className="bg-yellow-900 border-yellow-700">
              <AlertDescription className="text-yellow-200">
                Connect to an NFC tag to configure URL mirroring
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
            <div>
              <Label className="text-slate-300">Enable URL Mirroring</Label>
              <p className="text-xs text-slate-400">Dynamic URL generation with tag data</p>
            </div>
            <Switch
              checked={mirror.enabled}
              onCheckedChange={(checked) => setMirror({...mirror, enabled: checked})}
              disabled={!isConnected}
            />
          </div>

          {mirror.enabled && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="baseUrl" className="text-slate-300">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={mirror.baseUrl}
                  onChange={(e) => setMirror({...mirror, baseUrl: e.target.value})}
                  placeholder="https://api.example.com/tag"
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Include UID</Label>
                    <p className="text-xs text-slate-400">Add tag UID to URL</p>
                  </div>
                  <Switch
                    checked={mirror.includeUID}
                    onCheckedChange={(checked) => setMirror({...mirror, includeUID: checked})}
                    disabled={!isConnected}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Include Counter</Label>
                    <p className="text-xs text-slate-400">Add read counter</p>
                  </div>
                  <Switch
                    checked={mirror.includeCounter}
                    onCheckedChange={(checked) => setMirror({...mirror, includeCounter: checked})}
                    disabled={!isConnected}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Include Timestamp</Label>
                    <p className="text-xs text-slate-400">Add current timestamp</p>
                  </div>
                  <Switch
                    checked={mirror.includeTimestamp}
                    onCheckedChange={(checked) => setMirror({...mirror, includeTimestamp: checked})}
                    disabled={!isConnected}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="customParameters" className="text-slate-300">Custom Parameters</Label>
                <Textarea
                  id="customParameters"
                  value={mirror.customParameters}
                  onChange={(e) => setMirror({...mirror, customParameters: e.target.value})}
                  placeholder="param1=value1&param2=value2"
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={!isConnected}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cacheTTL" className="text-slate-300">Cache TTL (seconds)</Label>
                  <Input
                    id="cacheTTL"
                    type="number"
                    value={mirror.cacheTTL}
                    onChange={(e) => setMirror({...mirror, cacheTTL: parseInt(e.target.value) || 3600})}
                    className="bg-slate-700 border-slate-600 text-white"
                    disabled={!isConnected}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
                  <div>
                    <Label className="text-slate-300">Force SSL</Label>
                    <p className="text-xs text-slate-400">Require HTTPS</p>
                  </div>
                  <Switch
                    checked={mirror.enableSSL}
                    onCheckedChange={(checked) => setMirror({...mirror, enableSSL: checked})}
                    disabled={!isConnected}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <Button 
              onClick={handleConfigure}
              disabled={!isConnected || !mirror.enabled || isConfiguring}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isConfiguring ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Configuring...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Configure Mirror
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {previewUrl && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-green-400" />
              URL Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-slate-300">Generated URL</Label>
                <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-slate-800 rounded text-sm text-green-400 font-mono break-all">
                  {previewUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(previewUrl)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(previewUrl, '_blank')}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-2 bg-slate-900 rounded">
                <div className="text-slate-400">Parameters</div>
                <div className="text-white font-semibold">
                  {[mirror.includeUID && 'UID', mirror.includeCounter && 'Counter', mirror.includeTimestamp && 'Time']
                    .filter(Boolean).length || 0}
                </div>
              </div>
              <div className="text-center p-2 bg-slate-900 rounded">
                <div className="text-slate-400">Cache TTL</div>
                <div className="text-white font-semibold">{mirror.cacheTTL}s</div>
              </div>
              <div className="text-center p-2 bg-slate-900 rounded">
                <div className="text-slate-400">SSL</div>
                <div className="text-white font-semibold">{mirror.enableSSL ? 'Yes' : 'No'}</div>
              </div>
              <div className="text-center p-2 bg-slate-900 rounded">
                <div className="text-slate-400">Status</div>
                <div className="text-green-400 font-semibold">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default URLMirror;
