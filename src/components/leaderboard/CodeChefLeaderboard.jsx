import { Tab, TabList, TabPanel, TabPanels, Table, TableContainer, Tabs, Tag, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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
  console.log(leaderboardsData);

  const categorizeWinnersByContest = () => {
    const categories = {};

    if (leaderboardsData && leaderboardsData.winners) {
      leaderboardsData.winners.forEach((winner) => {
        const contestName = winner.contestName || 'Unknown Contest';

        if (!categories[contestName]) {
          categories[contestName] = [];
        }

        categories[contestName].push(winner);
      });
    }

    return categories;
  };

  const categories = categorizeWinnersByContest();

  return (
    <div className="mb-10">
      <Tabs isFitted>
        <TabList className="flex justify-between">
          {Object.keys(categories).map((contestName, index) => (
            <Tab key={index}>{`${contestName}`}</Tab>
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
                      <Th>Stars</Th>
                      <Th isNumeric>Contest Rank</Th>
                      <Th >Section</Th>
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
                        <Td><Tag variant={"outline"}>{winner.stars}<AiFillStar className="ml-2" /></Tag></Td>
                        <Td isNumeric>{winner.contestGlobalRank}</Td>
                        <Td >{winner.section}</Td>
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
