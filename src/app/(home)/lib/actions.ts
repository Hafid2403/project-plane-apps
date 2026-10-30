"use server";

import { auth } from "@/lib/auth";
import { objectToParams } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logout(): Promise<void> {
	await auth.api.signOut({ headers: await headers() });
	revalidatePath("/");
	redirect("/");
}

export async function searchFlight(formData: FormData) {
	const searchData = {
		departure: formData.get("departure"),
		arrival: formData.get("arrival"),
		date: formData.get("date"),
	};

	const queryParams = objectToParams(searchData);

	redirect(`/available-flights?${queryParams}`);
}
