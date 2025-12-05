// Just documenting shapes in comments

// TaskStatus: 'todo' | 'in_progress' | 'done'
// TaskPriority: 'low' | 'medium' | 'high' | 'critical'

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string | undefined} description
 * @property {'todo' | 'in_progress' | 'done'} status
 * @property {'low' | 'medium' | 'high' | 'critical'} priority
 * @property {string | undefined} dueDate // ISO string
 * @property {string} createdAt
 * @property {string} updatedAt
 */

module.exports = {};