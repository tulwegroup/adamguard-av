'use client';

import { motion } from 'framer-motion';
import { Crown, Eye, Search, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { TeamMember } from '@/lib/mockData';

interface TeamActivityProps {
  members: TeamMember[];
}

const roleConfig = {
  Admin: { icon: Crown, color: 'bg-yellow-500/20 text-yellow-400' },
  Analyst: { icon: Search, color: 'bg-blue-500/20 text-blue-400' },
  Viewer: { icon: Eye, color: 'bg-gray-500/20 text-gray-400' }
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500'
};

function formatLastActive(member: TeamMember): string {
  if (member.status === 'online') return 'Online';
  
  const memberDate = new Date(member.lastActive);
  const baseDate = new Date('2024-12-15T12:00:00.000Z'); // Fixed base date
  const diffMs = baseDate.getTime() - memberDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return memberDate.toLocaleDateString();
}

export function TeamActivity({ members }: TeamActivityProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Team Members</h3>
        <p className="text-sm text-gray-400">
          {members.filter(m => m.status === 'online').length} online
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, index) => {
          const role = roleConfig[member.role];
          const RoleIcon = role.icon;

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600">
                      <AvatarFallback className="text-white font-medium">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${statusColors[member.status]}`}
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={role.color}>
                  <RoleIcon className="w-3 h-3 mr-1" />
                  {member.role}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatLastActive(member)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h4 className="text-sm font-medium text-gray-300 mb-4">Recent Team Activity</h4>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-sm"
          >
            <Circle className="w-2 h-2 text-green-500 fill-green-500" />
            <span className="text-gray-400"><span className="text-white">Sarah Chen</span> updated protection settings</span>
            <span className="text-gray-500 text-xs ml-auto">5m ago</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 text-sm"
          >
            <Circle className="w-2 h-2 text-blue-500 fill-blue-500" />
            <span className="text-gray-400"><span className="text-white">Michael Torres</span> started a full system scan</span>
            <span className="text-gray-500 text-xs ml-auto">15m ago</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 text-sm"
          >
            <Circle className="w-2 h-2 text-red-500 fill-red-500" />
            <span className="text-gray-400"><span className="text-white">Jessica Brown</span> quarantined Trojan.Emotet</span>
            <span className="text-gray-500 text-xs ml-auto">1h ago</span>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
