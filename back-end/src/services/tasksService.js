const { supabase } = require('../config/supabaseClient');

// Map DB row → API Task shape
function mapRowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date ? new Date(row.due_date).toISOString() : undefined,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

// GET all tasks
async function getAllTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }

  return data.map(mapRowToTask);
}

// GET by id
async function getTaskById(id) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // row not found
    console.error('Error fetching task by id:', error);
    throw new Error('Failed to fetch task');
  }

  return mapRowToTask(data);
}

// CREATE
async function createTask(input) {
  const payload = {
    title: input.title,
    description: input.description ?? null,
    status: input.status || 'todo',
    priority: input.priority || 'medium',
    due_date: input.dueDate ? new Date(input.dueDate).toISOString() : null,
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }

  return mapRowToTask(data);
}

// UPDATE
async function updateTask(id, changes) {
  const payload = {};

  if (changes.title !== undefined) payload.title = changes.title;
  if (changes.description !== undefined) payload.description = changes.description;
  if (changes.status !== undefined) payload.status = changes.status;
  if (changes.priority !== undefined) payload.priority = changes.priority;

  if (changes.dueDate !== undefined) {
    // allow null to clear
    payload.due_date = changes.dueDate
      ? new Date(changes.dueDate).toISOString()
      : null;
  }

  if (Object.keys(payload).length === 0) {
    // nothing to update
    const existing = await getTaskById(id);
    return existing;
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }

  return mapRowToTask(data);
}

// DELETE
async function deleteTask(id) {
  const { error, count } = await supabase
    .from('tasks')
    .delete({ count: 'exact' })
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }

  return (count ?? 0) > 0;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};