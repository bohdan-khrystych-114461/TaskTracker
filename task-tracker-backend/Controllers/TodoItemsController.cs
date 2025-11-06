using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTrackerAPI.Data;
using TaskTrackerAPI.Models;

namespace TaskTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly TaskTrackerDbContext _context;

    public TodoItemsController(TaskTrackerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
    {
        var items = await _context.TodoItems
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoItem(Guid id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);

        if (todoItem == null)
        {
            return NotFound();
        }

        return Ok(todoItem);
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItem todoItem)
    {
        todoItem.Id = Guid.NewGuid();
        todoItem.CreatedAt = DateTime.UtcNow;

        _context.TodoItems.Add(todoItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTodoItem), new { id = todoItem.Id }, todoItem);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoItem(Guid id, TodoItem todoItem)
    {
        if (id != todoItem.Id)
        {
            return BadRequest();
        }

        var existingItem = await _context.TodoItems.FindAsync(id);
        if (existingItem == null)
        {
            return NotFound();
        }

        existingItem.Title = todoItem.Title;
        existingItem.Description = todoItem.Description;
        existingItem.IsCompleted = todoItem.IsCompleted;
        
        if (todoItem.IsCompleted && !existingItem.IsCompleted)
        {
            existingItem.CompletedAt = DateTime.UtcNow;
        }
        else if (!todoItem.IsCompleted && existingItem.IsCompleted)
        {
            existingItem.CompletedAt = null;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(Guid id)
    {
        var todoItem = await _context.TodoItems.FindAsync(id);
        if (todoItem == null)
        {
            return NotFound();
        }

        _context.TodoItems.Remove(todoItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
