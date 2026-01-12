'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  sentAt: Date;
  recipientCount: number;
}

export function NotificationHistoryTable({ logs }: { logs: NotificationLog[] }) {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Content Preview</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
             <TableRow><TableCell colSpan={5} className="text-center h-24">No history yet.</TableCell></TableRow>
          ) : (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.sentAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="font-medium">{log.title}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={log.body}>{log.body}</TableCell>
                <TableCell>{log.recipientCount}</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sent</Badge></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}