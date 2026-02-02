'use client';

import { useState, useEffect } from 'react';

export function HeaderInfo() {
  const [date, setDate] = useState('');

  useEffect(() => {
    // Format the date once the component mounts on the client
    const today = new Date();
    const formattedDate = today.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    setDate(formattedDate.replace(/,/g, ','));

  }, []);

  return (
     <div className="hidden md:flex items-center text-[11px] lg:text-sm text-muted-foreground">
      <span>{date}</span>
    </div>
  );
}