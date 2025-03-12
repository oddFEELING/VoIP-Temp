"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getTransactionsAndItemsById } from "@/actions/payment.actions";

type ComponentProps = {};

const TestPage: React.FC<ComponentProps> = ({}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["test-query"],
    queryFn: () =>
      getTransactionsAndItemsById("8b30ca3c-4156-41e0-a6a4-daa1a9df5e2f"),
  });

  return (
    <div className="my-28 ml-20 mt-20">
      <Button
        onClick={async () => {
          await axios.post("/api/emails/purchase-success", {
            transaction_id: "8b30ca3c-4156-41e0-a6a4-daa1a9df5e2f",
          });
        }}
      >
        CLick me
      </Button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default TestPage;
