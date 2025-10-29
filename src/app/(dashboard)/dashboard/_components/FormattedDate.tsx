'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  date: Date;
}

export function FormattedDate({ date }: FormattedDateProps) {
  const [isClient, setIsClient] = useState(false);

  // This effect runs only on the client, after the component has mounted.
  useEffect(() => {
    setIsClient(true);
  }, []);

  // On the server and during the initial client render, we render nothing or a placeholder.
  // Once the client has mounted, we render the locally formatted date.
  return (
    <span>
      {isClient ? new Date(date).toLocaleDateString() : '...'}
    </span>
  );
}