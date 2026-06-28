"use client";

import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

export function SubscriberOverview() {
  const [customers, setCustomers] = useState<RecentCustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/registrations");
        
        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }
        
        const result = await response.json();
        setCustomers(result.data);
        setTotalCount(result.count);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load registrations");
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">
          {loading ? "Loading..." : `${totalCount} Students`}
        </CardTitle>
        <CardDescription>
          {error ? error : "Recent student records with signup activity."}
        </CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-500">
            Failed to load data. Please try again later.
          </div>
        ) : (
          <RecentCustomersTable data={customers} />
        )}
      </CardContent>
    </Card>
  );
}
