using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTrackerAPI.Data;
using TaskTrackerAPI.Models;

namespace TaskTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TimeBlocksController : ControllerBase
{
    private readonly TaskTrackerDbContext _context;

    public TimeBlocksController(TaskTrackerDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimeBlock>>> GetTimeBlocks(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.TimeBlocks.AsQueryable();

        if (startDate.HasValue)
        {
            query = query.Where(tb => tb.Date >= startDate.Value.Date);
        }

        if (endDate.HasValue)
        {
            query = query.Where(tb => tb.Date <= endDate.Value.Date);
        }

        var blocks = await query
            .OrderBy(tb => tb.StartTime)
            .ToListAsync();

        return Ok(blocks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TimeBlock>> GetTimeBlock(Guid id)
    {
        var timeBlock = await _context.TimeBlocks.FindAsync(id);

        if (timeBlock == null)
        {
            return NotFound();
        }

        return Ok(timeBlock);
    }

    [HttpPost]
    public async Task<ActionResult<TimeBlock>> CreateTimeBlock(TimeBlock timeBlock)
    {
        timeBlock.Id = Guid.NewGuid();
        timeBlock.CreatedAt = DateTime.UtcNow;
        timeBlock.UpdatedAt = DateTime.UtcNow;

        _context.TimeBlocks.Add(timeBlock);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTimeBlock), new { id = timeBlock.Id }, timeBlock);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTimeBlock(Guid id, TimeBlock timeBlock)
    {
        if (id != timeBlock.Id)
        {
            return BadRequest();
        }

        var existingBlock = await _context.TimeBlocks.FindAsync(id);
        if (existingBlock == null)
        {
            return NotFound();
        }

        existingBlock.TaskName = timeBlock.TaskName;
        existingBlock.StartTime = timeBlock.StartTime;
        existingBlock.EndTime = timeBlock.EndTime;
        existingBlock.Duration = timeBlock.Duration;
        existingBlock.Date = timeBlock.Date;
        existingBlock.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTimeBlock(Guid id)
    {
        var timeBlock = await _context.TimeBlocks.FindAsync(id);
        if (timeBlock == null)
        {
            return NotFound();
        }

        _context.TimeBlocks.Remove(timeBlock);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
