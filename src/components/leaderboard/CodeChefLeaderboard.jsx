import { Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchLeaderboardsData } from '../../services/leaderboardServices';

const CodeChefLeaderboard = () => {
  const { contestName } = useParams();
  const [leaderboardsData, setLeaderboardsData] = useState([]);

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

  const categorizeWinnersByStars = () => {
    const categories = {};

    if (leaderboardsData && leaderboardsData.winners) {
      leaderboardsData.winners.forEach((winner) => {
        const stars = winner.stars || 0;
        if (!categories[stars]) {
          categories[stars] = [];
        }
        categories[stars].push(winner);
      });
    }

    return categories;
  };


  const categories = categorizeWinnersByStars();

  return (
    <div>
      <Tabs isFitted>
        <TabList className="flex justify-between">
          {Object.keys(categories).map((stars, index) => (
            <Tab key={index}><AiFillStar className="mr-2"/> {`${stars} Star`}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {Object.keys(categories).map((stars, index) => (
            <TabPanel key={index}>
              <TableContainer>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th>Library Id</Th>
                      <Th>Name</Th>
                      <Th>Branch</Th>
                      <Th>Codechef Id</Th>
                      <Th isNumeric>Contest Rank</Th>
                      <Th isNumeric>Roll No</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories[stars].map((winner, winnerIndex) => (
                      <Tr key={winnerIndex}>
                        <Td>{winner.libId}</Td>
                        <Td>{winner.username}</Td>
                        <Td>{winner.branch}</Td>
                        <Td>{winner.codechefId}</Td>
                        <Td isNumeric>{winner.contestGlobalRank}</Td>
                        <Td isNumeric>{winner.rollNo}</Td>
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
