
class IssueValidator {
    validateCreate(formData) {
        const title = formData.get('title');
        const description = formData.get('description');
        const type = formData.get('type');
        const priority = formData.get('priority');

        if (!title || !description || !type) {
            throw new Error('Please fill in all required fields');
        }

        const validTypes = ['Cloud Security', 'Reteam Assessment', 'VAPT'];
        if (!validTypes.includes(type)) {
            throw new Error('Invalid issue type');
        }

        return { title, description, type, priority: priority || 'Medium' };
    }
}

export default IssueValidator;
