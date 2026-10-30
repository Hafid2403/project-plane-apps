"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButtonForm({ pending }: { pending?: boolean }) {
	const status = useFormStatus();
	const isPending = pending ?? status.pending;

	return (
		<Button type="submit" disabled={isPending} className="w-full">
			{isPending ? "Loading..." : "Submit"}
		</Button>
	);
}
