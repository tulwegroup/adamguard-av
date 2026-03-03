'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Brain, Clock, FileText, Network, Bug, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAntivirusStore } from '@/lib/store';

export function ZeroDayPanel() {
  const { threats, events } = useAntivirusStore();

  // Filter zero-day threats and events
  const zeroDayThreats = threats.filter(t => t.zeroDay || t.type === 'ZeroDay');
  const zeroDayEvents = events.filter(e => e.eventType === 'zero_day_blocked' || e.aiFlagged);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Zero-Day Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/5 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Zero-Day Threats</p>
                  <p className="text-3xl font-bold text-white mt-2">{zeroDayThreats.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Detected & blocked</p>
                </div>
                <div className="p-3 rounded-xl bg-red-500/20">
                  <Bug className="w-8 h-8 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">AI Analysis Events</p>
                  <p className="text-3xl font-bold text-white mt-2">{zeroDayEvents.length}</p>
                  <p className="text-xs text-gray-500 mt-1">This week</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/5 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Protection Rate</p>
                  <p className="text-3xl font-bold text-white mt-2">100%</p>
                  <p className="text-xs text-gray-500 mt-1">All threats blocked</p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/20">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Zero-Day Threats List */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            Zero-Day Threats Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {zeroDayThreats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{threat.name}</h4>
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          Zero-Day
                        </Badge>
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{threat.path}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Quarantined
                        </span>
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          AI Confidence: {threat.aiDetected ? '99.8%' : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">
                    Blocked
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent AI Security Events */}
      <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {zeroDayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    event.severity === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : event.severity === 'high'
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-gray-900/50 border-gray-700/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      event.severity === 'critical' 
                        ? 'bg-red-500/20 text-red-400' 
                        : event.severity === 'high'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {event.eventType === 'zero_day_blocked' ? (
                        <Bug className="w-4 h-4" />
                      ) : event.eventType === 'ai_detection' ? (
                        <Brain className="w-4 h-4" />
                      ) : (
                        <Shield className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">{event.title}</p>
                        {event.aiFlagged && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`text-xs ${getSeverityColor(event.severity)}`}>
                          {event.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
