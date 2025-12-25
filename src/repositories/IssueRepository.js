
import Issue from '@/models/Issue';

class IssueRepository {
    async create(issueData) {
        return await Issue.create(issueData);
    }

    async findById(id) {
        return await Issue.findById(id);
    }

    async deleteById(id) {
        return await Issue.deleteOne({ _id: id });
    }

    async updateStatus(id, status) {
        const issue = await this.findById(id);
        if (!issue) return null;
        issue.status = status;
        return await issue.save();
    }

    async findAllByUserId(userId, filterType) {
        const query = { userId };
        if (filterType && filterType !== 'All') {
            query.type = filterType;
        }
        return await Issue.find(query).sort({ createdAt: -1 });
    }
}

export default IssueRepository;
