
'use server';

import IssueController from '@/controllers/IssueController';
import { revalidatePath } from 'next/cache';

const issueController = new IssueController();

export async function createIssue(prevState, formData) {
    // If called directly from form action, formData is the second arg.
    // If called programmatically with just formData, standard action behavior applies? 
    // With useActionState, it's (prevState, formData).
    // But DashboardClient calls createIssue(null, formData) so we are good.

    const result = await issueController.create(formData);

    if (result.success) {
        revalidatePath('/dashboard');
    }
    return result;
}

export async function deleteIssue(issueId) {
    const result = await issueController.delete(issueId);
    if (result.success) {
        revalidatePath('/dashboard');
    }
    return result;
}

export async function updateIssueStatus(issueId, newStatus) {
    const result = await issueController.updateStatus(issueId, newStatus);
    if (result.success) {
        revalidatePath('/dashboard');
    }
    return result;
}

export async function getIssues(filterType) {
    return await issueController.getIssues(filterType);
}
