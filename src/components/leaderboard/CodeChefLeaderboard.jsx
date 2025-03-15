import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Avatar,
  Box,
  Text,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLeaderboardsData } from "../../services/leaderboardServices";

const CodeChefLeaderboard = () => {
  const { contestName } = useParams();
  const [leaderboardsData, setLeaderboardsData] = useState([]);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URI || "http://localhost:5001";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLeaderboardsData(contestName);
        setLeaderboardsData(data);
      } catch (error) {
        console.error(error);
        // Handle error, show an error message, or set an error state
      }
    };

    fetchData();
  }, [contestName]);
  console.log(leaderboardsData);

  const categorizeWinnersByStars = () => {
    const categories = {};

    if (leaderboardsData && leaderboardsData.winners) {
      leaderboardsData.winners.forEach((winner) => {
        const contestName = winner.contestName || "Unknown Contest";

        const stars =
          contestName + " - (" + winner.stars + " Star)" || "No Stars";

        if (!categories[stars]) {
          categories[stars] = [];
        }

        categories[stars].push(winner);
      });

      // Sort and slice top 3 performers for each category
      Object.keys(categories).forEach((stars) => {
        if (
          stars.includes("1 Star") ||
          stars.includes("2 Star") ||
          stars.includes("3 Star") ||
          stars.includes("4 Star") ||
          stars.includes("5 Star")
        ) {
          categories[stars] = categories[stars]
            .sort((a, b) => a.contestGlobalRank - b.contestGlobalRank)
            .slice(0, 3);
        }
      });
    }

    return categories;
  };

  const getOrdinalSuffix = (i) => {
    const j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + "st";
    }
    if (j === 2 && k !== 12) {
      return i + "nd";
    }
    if (j === 3 && k !== 13) {
      return i + "rd";
    }
    return i + "th";
  };

  const getMedalType = (position) => {
    switch (position) {
      case 1:
        return "🥇"; // Gold medal emoji
      case 2:
        return "🥈"; // Silver medal emoji
      case 3:
        return "🥉"; // Bronze medal emoji
      default:
        return "";
    }
  };

  const categories = categorizeWinnersByStars();

  return (
    <div className="mb-10">
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "2em",
          fontWeight: "bold",
        }}
      >
        CodeChef Leaderboard
      </h1>
      <Tabs isFitted>
        <TabList className="flex justify-between" style={{ color: "white" }}>
          {Object.keys(categories).map((stars, index) => (
            <Tab
              key={index}
              style={{ fontSize: "1.2em", fontWeight: "bold" }}
            >{`${stars}`}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.keys(categories).map((stars, index) => (
            <TabPanel key={index}>
              <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="space-around"
                mb="20px"
              >
                {categories[stars].slice(0, 3).map((winner, winnerIndex) => (
                  <Box
                    className="bg-zinc-950"
                    key={winnerIndex}
                    textAlign="center"
                    p="10px"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    width={["100%", "45%", "30%"]} // Responsive width
                    mb="10px" // Add margin-bottom for spacing on small screens
                  >
                    <Text fontSize={["2em", "2em"]} fontWeight="bold">
                      {getMedalType(winnerIndex + 1)}{" "}
                      {getOrdinalSuffix(winnerIndex + 1)}
                    </Text>
                    <Image
                      borderRadius="full"
                      boxSize={["80px", "100px", "120px"]}
                      as={Avatar}
                      src={`${backendUrl}${winner.userImage}`}
                      margin="10px auto"
                    />
                    <Text fontSize={["1em", "1.2em"]} fontWeight="bold">
                      {winner.username}
                    </Text>
                    <Text fontSize={["0.8em", "1em"]} fontWeight="bold">{winner.branch}</Text>
                    <Text fontSize={["0.8em", "1em"]} fontWeight="bold">{winner.codechefId}</Text>
                    <Tag style={{ color: "white", backgroundColor: "black" }} fontWeight="bold">
                      {winner.stars}
                      <AiFillStar className="ml-2" />
                    </Tag>
                    {/* <Text>{winner.section}</Text> */}
                  </Box>
                ))}
              </Box>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Position
                      </Th>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Name of Participant
                      </Th>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Branch
                      </Th>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Codechef Id
                      </Th>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Stars
                      </Th>
                      <Th
                        style={{ fontSize: "1em", fontWeight: "bold" }}
                        isNumeric
                      >
                        Global Rank
                      </Th>
                      <Th style={{ fontSize: "1em", fontWeight: "bold" }}>
                        Section
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories[stars].map((winner, winnerIndex) => (
                      <Tr
                        key={winnerIndex}
                        style={{ fontSize: "1em", fontWeight: "bold" }}
                      >
                        <Td style={{ textAlign: "center" }}>
                          {getOrdinalSuffix(winnerIndex + 1)}
                        </Td>
                        <Td
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            borderRadius="full"
                            boxSize="50px"
                            as={Avatar}
                            src={`${backendUrl}${winner.userImage}`}
                            marginRight="10px"
                          />
                          {winner.username}
                        </Td>
                        <Td style={{ textAlign: "center" }}>{winner.branch}</Td>
                        <Td style={{ textAlign: "center" }}>
                          {winner.codechefId}
                        </Td>
                        <Td style={{ textAlign: "center" }}>
                          <Tag
                            style={{ color: "white", backgroundColor: "black" }}
                          >
                            {winner.stars}
                            <AiFillStar className="ml-2" />
                          </Tag>
                        </Td>
                        <Td isNumeric style={{ textAlign: "center" }}>
                          {winner.contestGlobalRank}
                        </Td>
                        <Td style={{ textAlign: "center" }}>
                          {winner.section}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default CodeChefLeaderboard;
