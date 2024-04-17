#include "InputDataReader.hpp"
#include "CompositeGenome.hpp"
#include "FigureDimentionsGlobalStorage.hpp"
#include "ResultsWriter.hpp"
#include "Figure.hpp"
#include "SolutionCleaner.hpp"
#include "ObjectiveFunction.hpp"
#include "CuttingStockProblemGeneticSolver.hpp"

#include <iostream>
#include <chrono>

std::vector<std::pair<int, int>> readInputFromStdin()
{
    // Vector to store pairs of width and height
    std::vector<std::pair<int, int>> pieces;

    // Read input from stdin until end of file
    int width, height;
    while (std::cin >> width >> height)
    {
        // Create a pair and add it to the vector
        pieces.push_back(std::make_pair(width, height));
    }

    return pieces;
}

int main(int argc, char **argv)
{
    std::vector<std::pair<int, int>> inputPieces;

    auto figuresDimentions = readInputFromStdin(); // InputDataReader().fromFile("maleplyty.txt");
    FigureDimentionsGlobalStorage::instance(figuresDimentions);

    auto algorithmStartTime = std::chrono::steady_clock::now();

    std::cerr << "Running genetic algorithm. This may take a while ... " << std::endl
              << std::endl;
    CuttingStockProblemGeneticSolver cuttingStockProblemGeneticSolver(0.05, 0.75, 1000, 1000);
    CompositeGenome bestGenome = cuttingStockProblemGeneticSolver.run(figuresDimentions.size(), objectiveFunction);
    std::cerr << "Best solution returned from genetic algorithm: \n"
              << bestGenome << std::endl;

    std::cerr << "Cleaning the solution. This may take a while ... " << std::endl;
    SolutionCleaner::removeFiguresThatBreakTheSolution(bestGenome);
    SolutionCleaner::moveAllFiguresTowardsTheOrigin(bestGenome);

    auto algorithmFirstPartEndTime = std::chrono::steady_clock::now();
    std::chrono::duration<double> timeDifference = algorithmFirstPartEndTime - algorithmStartTime;
    if (timeDifference.count() < 120)
    {
        std::cerr << "Improving the solution. This may take a while ... " << std::endl
                  << std::endl;
        SolutionCleaner::tryToAddRemainingFigures(bestGenome);
    }

    std::cerr << "Best solution after cleaning: \n"
              << bestGenome << std::endl;

    std::cerr << "Writing to file output.txt ..." << std::endl
              << std::endl;
    ResultsWriter resultsWriter(bestGenome, FigureDimentionsGlobalStorage::instance());
    // resultsWriter.toFile("output.txt");
    resultsWriter.toStandardOutput();

    auto algorithmEndTime = std::chrono::steady_clock::now();
    timeDifference = algorithmEndTime - algorithmStartTime;
    std::cerr << "Elapsed time: " << timeDifference.count() << "s" << std::endl;

    return 0;
}
