import json
import matplotlib.pyplot as plt

def plotOutput(fileName):
    with open(fileName) as f:
        results = json.load(f)

    # Extract data
    chunk_sizes = [res['chunkSize'] / 1024 for res in results]  # Convert to KB
    times = [res['time'] for res in results]
    memory_usage = [res['memoryUsage'] / (1024 * 1024) for res in results]  # Convert to MB

    # Plot chunk size vs time
    plt.figure(figsize=(10, 5))
    plt.plot(chunk_sizes, times, marker='o')
    plt.title('Chunk Size vs Time Taken')
    plt.xlabel('Chunk Size (KB)')
    plt.ylabel('Time (ms)')
    plt.grid(True)
    plt.savefig(f'chunk_size_vs_time-{fileName[:-5]}.png')

    # Plot chunk size vs memory usage
    plt.figure(figsize=(10, 5))
    plt.plot(chunk_sizes, memory_usage, marker='o')
    plt.title('Chunk Size vs Memory Usage')
    plt.xlabel('Chunk Size (KB)')
    plt.ylabel('Memory Usage (MB)')
    plt.grid(True)
    plt.savefig(f'chunk_size_vs_memory-{fileName[:-5]}.png')

    plt.show()

if __name__ == '__main__':
    plotOutput('small.json')
    plotOutput('medium.json')
    plotOutput('big.json')