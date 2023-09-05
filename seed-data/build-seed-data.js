const { faker } = require("@faker-js/faker");

const numUsers = 150;
const numAgents = 10;
const numTickets = 200;


function generateRandomUser(index) {
  const firstname = faker.person.firstName();
  const lastname = faker.person.lastName();
  const user = {
    // id: faker.string.uuid(),
    id: index,
    username: faker.internet.displayName({
      firstName: firstname,
      lastName: lastname,
    }),
    password: faker.internet.password(),
    first_name: firstname,
    last_name: lastname,
    phone_number: faker.phone.number(),
    email: faker.internet.email({ firstName: firstname, lastName: lastname }),
    role: "client",
    is_anonymous: false,
    avatar: faker.internet.avatar()
  };
  return user;
}

const usersData = [];
for (let i = 1; i <= numUsers; i++) {
  usersData.push(generateRandomUser(i))
}

// const usersData = Array.from({ length: 150 }, () => generateRandomUser());

const organizationNames = [
  "Loyal Bank of Canada",
  "Horizon Finance Corporation",
  "Silverstone Savings & Loan",
  "Unity National Bank",
  "Stellar Financial Services",
  "BlueSky Bancorp",
  "Royal Crest Bank",
  "Capital Haven Investments",
  "Sapphire Financial Group",
  "Liberty Financial Alliance",
  "Golden Harbor Bank",
  "Apex Capital Solutions",
  "Evergreen Equity Bank",
  "Cascade Financial Partners",
  "Oasis Financial Trust",
  "Pinnacle Wealth Management",
  "Pacific Pearl Savings",
  "Summit Ridge Finance",
  "Prestige Banking Corporation",
  "Sunrise Credit Union",
];

const generateOrganizations = () => {
  return organizationNames.map((orgName, index) => {
    return {
      // id: faker.string.uuid(),
      id: index + 1,
      name: orgName,
    };
  });
};

const organizationsData = generateOrganizations();

const selectRandomUsers = (numberUsers) => {
  let randomUsers = [];
  while (randomUsers.length < numberUsers) {
    const randomInt = Math.floor(Math.random() * usersData.length);
    if (randomUsers.indexOf(randomInt) === -1) {
      randomUsers.push(usersData[randomInt]);
      usersData[randomInt] = { ...usersData[randomInt], role: "agent" };
    }
  }
  return randomUsers;
};

const generateAgents = () => {
  return selectRandomUsers(numAgents).map((randomUser, index) => {
    return {
      // id: faker.string.uuid(),
      id: index + 1,
      organization_id: organizationsData[0].id,
      user_id: randomUser.id,
    };
  });
};

const agentsData = generateAgents();

const inquiryOptions = [
  "Balances",
  "Chequing",
  "Savings",
  "Transfers",
  "Wire Transfer",
  "International",
  "Domestic",
  "Bank Transfer",
  "Bill Payments",
  "Mortgages",
  "Mutual Fund",
  "Credit Card",
  "Change Limit",
  "Suspicious Activity",
  "Report Card Lost or Stolen",
  "Suspicious Activity",
  "Loan",
  "Line of Credit",
  "Interest rates",
  "Suspicious Activity",
  "Investments",
  "Online Banking Technical Support",
  "Password Reset",
  "Account Lockouts",
  "Website Inaccesible",
  "Complaints and Feedback",
  "Service Quality",
  "Dispute About Fees",
  "Issues With Bank Representatives",
];

const statuses = [
  "Open",
  "In Progress",
  "Waiting for Customer Response",
  "On Hold",
  "Closed",
  "Reopened",
  "Cancelled",
];

const generateTickets = (index) => {
  const clientUsers = usersData.filter((users) => users.role === "client");
  const agentUsers = usersData.filter((users) => users.role === "agent");
  const randomUser =
    clientUsers[Math.floor(Math.random() * clientUsers.length)];
  const randomAgent = agentUsers[Math.floor(Math.random() * agentUsers.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const ticket = {
    // id: faker.string.uuid(),
    id: index,
    inquiry_option:
      inquiryOptions[Math.floor(Math.random() * inquiryOptions.length)],
    client_first_name: randomUser.first_name,
    client_last_name: randomUser.last_name,
    client_phone_number: randomUser.phone_number,
    client_email: randomUser.email,
    user_id: randomUser.id,
    agent_id: agentsData.find((agent) => agent.user_id === randomAgent.id).id,
    status: randomStatus,
    organization_id: organizationsData[0].id,
  };
  return ticket;
};


const ticketsData  = [];
for (let i = 1; i <= numTickets; i++) {
  ticketsData.push(generateTickets(i))
}

// const ticketsData = Array.from({ length: 200 }, () => generateTickets());

module.exports = {
  usersData,
  organizationsData,
  agentsData,
  ticketsData,
};
