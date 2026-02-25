'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Trash2, Eye, AlertTriangle, FileX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { QuarantinedFile } from '@/lib/mockData';

interface QuarantineListProps {
  files: QuarantinedFile[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

const threatTypeColors: Record<string, string> = {
  Trojan: 'bg-red-500/20 text-red-400',
  Ransomware: 'bg-purple-500/20 text-purple-400',
  Virus: 'bg-orange-500/20 text-orange-400',
  Worm: 'bg-yellow-500/20 text-yellow-400',
  PUP: 'bg-blue-500/20 text-blue-400',
  Adware: 'bg-green-500/20 text-green-400',
  Spyware: 'bg-pink-500/20 text-pink-400'
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatQuarantineDate(date: Date): string {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${months[d.getMonth()]} ${d.getDate()}, ${hours}:${minutes}`;
}

export function QuarantineList({ files, onRestore, onDelete }: QuarantineListProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Quarantined Files</h3>
            <p className="text-sm text-gray-400 mt-1">{files.length} items in quarantine</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <FileX className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
      
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800/50">
              <TableHead className="text-gray-400">Threat Name</TableHead>
              <TableHead className="text-gray-400">Original Path</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Size</TableHead>
              <TableHead className="text-gray-400">Quarantined</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, index) => (
              <motion.tr
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-gray-700 hover:bg-gray-800/30"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-white font-medium">{file.threatName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300 text-sm truncate max-w-[200px] block" title={file.originalPath}>
                    {file.originalPath}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={threatTypeColors[file.threatType] || 'bg-gray-500/20 text-gray-400'}>
                    {file.threatType}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{formatSize(file.size)}</TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {formatQuarantineDate(file.quarantinedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRestore(file.id)}
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      title="Restore"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(file.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
