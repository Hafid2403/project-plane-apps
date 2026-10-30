"use client";

import { type FormEvent, useActionState, useTransition } from "react";

/**
 * Pengganti useFormState (React 18).
 * Bedanya dengan useActionState biasa: isi form TIDAK dikosongkan
 * setelah submit gagal, jadi user tidak perlu mengetik ulang.
 */
export function useFormAction<State>(
	action: (state: Awaited<State>, formData: FormData) => State | Promise<State>,
	initialState: Awaited<State>
) {
	const [state, formAction, isActionPending] = useActionState(
		action,
		initialState
	);
	const [isTransitionPending, startTransition] = useTransition();

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(() => formAction(formData));
	};

	return {
		state,
		onSubmit,
		isPending: isActionPending || isTransitionPending,
	};
}
