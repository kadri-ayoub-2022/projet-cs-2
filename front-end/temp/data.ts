import type { ProjectTheme, ProjectTasks, Teams } from "../src/types";

// Sample data
export const projects: ProjectTheme[] = [
  {
    themeId: 1,
    title: "Website Redesign",
    description: "Complete redesign of the company website",
    progression: 65,
    date_selection_begin: new Date(2023, 2, 1),
    date_selection_end: new Date(2023, 5, 30),
    student1Id: 101,
    student2Id: 102,
    status: true,
  },
  {
    themeId: 2,
    title: "Mobile App Development",
    description: "Develop a new mobile application",
    progression: 30,
    date_selection_begin: new Date(2023, 3, 15),
    date_selection_end: new Date(2023, 6, 15),
    student1Id: 103,
    student2Id: 104,
    status: true,
  },
  {
    themeId: 3,
    title: "Marketing Campaign",
    description: "Plan and execute a marketing campaign",
    progression: 10,
    date_selection_begin: new Date(2023, 4, 1),
    date_selection_end: new Date(2023, 7, 1),
    student1Id: 105,
    student2Id: null,
    status: false,
  },
  {
    themeId: 4,
    title: "Product Launch",
    description: "Prepare for the new product launch",
    progression: 0,
    date_selection_begin: new Date(2023, 5, 1),
    date_selection_end: new Date(2023, 8, 1),
    student1Id: null,
    student2Id: null,
    status: false,
  },
];

// Team members data
export const teamMembers: Teams = {
  1: {
    supervisor: {
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@university.edu",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    students: [
      {
        id: 101,
        name: "Alex Chen",
        email: "alex.chen@university.edu",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 102,
        name: "Maria Rodriguez",
        email: "maria.rodriguez@university.edu",
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
  2: {
    supervisor: {
      name: "Prof. Michael Brown",
      email: "michael.brown@university.edu",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    students: [
      {
        id: 103,
        name: "Emma Davis",
        email: "emma.davis@university.edu",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      {
        id: 104,
        name: "David Kim",
        email: "david.kim@university.edu",
        avatar: "/placeholder.svg?height=80&width=80",
      },
    ],
  },
};

export const initialTasks: ProjectTasks = {
  1: [
    {
      taskId: 1,
      title: "Design Homepage",
      description:
        "Create wireframes and mockups for the new homepage design with focus on user experience and conversion optimization.",
      status: "COMPLETED",
      priority: "HIGH",
      createdAt: new Date(2023, 3, 10),
      date_begin: new Date(2023, 3, 15),
      date_end: new Date(2023, 3, 20),
      evaluation: "Excellent work, approved by the client",
      comments: [
        {
          commentId: 1,
          content: "Mockups look great! Let's proceed with development.",
          createdAt: new Date(2023, 3, 18),
          taskId: 1,
          author: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        {
          commentId: 2,
          content:
            "I've added some notes about the responsive behavior in the design file.",
          createdAt: new Date(2023, 3, 19),
          taskId: 1,
          author: "Alex Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      files: [
        {
          fileId: 1,
          fileName: "homepage-mockup.fig",
          createdAt: new Date(2023, 3, 16),
          taskId: 1,
          url: "#",
          size: "2.4 MB",
        },
        {
          fileId: 2,
          fileName: "wireframes.pdf",
          createdAt: new Date(2023, 3, 17),
          taskId: 1,
          url: "#",
          size: "1.8 MB",
        },
      ],
    },
    {
      taskId: 2,
      title: "Implement Responsive Design",
      description:
        "Make sure the website works well on all device sizes including mobile, tablet, and desktop. Test on various browsers.",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      createdAt: new Date(2023, 3, 20),
      date_begin: new Date(2023, 3, 21),
      date_end: null,
      evaluation: null,
      comments: [],
      files: [],
    },
    {
      taskId: 3,
      title: "Optimize Page Load Speed",
      description:
        "Analyze and improve the website's performance. Target a PageSpeed score of at least 90 on both mobile and desktop.",
      status: "IN_PROGRESS",
      priority: "LOW",
      createdAt: new Date(2023, 3, 24),
      date_begin: new Date(2023, 3, 25),
      date_end: null,
      evaluation: null,
      comments: [
        {
          commentId: 1,
          content: "I've identified several images that need compression.",
          createdAt: new Date(2023, 3, 26),
          taskId: 3,
          author: "Michael Chen",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      files: [
        {
          fileId: 1,
          fileName: "performance-report.pdf",
          createdAt: new Date(2023, 3, 26),
          taskId: 3,
          url: "#",
          size: "756 KB",
        },
      ],
    },
  ],
  2: [
    {
      taskId: 1,
      title: "Create App Wireframes",
      description:
        "Design the initial wireframes for the mobile application focusing on user flow and core functionality.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      createdAt: new Date(2023, 4, 1),
      date_begin: new Date(2023, 4, 1),
      date_end: null,
      evaluation: null,
      comments: [],
      files: [],
    },
    {
      taskId: 2,
      title: "Develop Authentication System",
      description:
        "Implement secure user authentication with social login options and two-factor authentication support.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      createdAt: new Date(2023, 4, 4),
      date_begin: new Date(2023, 4, 5),
      date_end: null,
      evaluation: null,
      comments: [
        {
          commentId: 1,
          content: "Let's use Firebase Auth for this to save development time.",
          createdAt: new Date(2023, 4, 6),
          taskId: 2,
          author: "Sarah Williams",
          avatar: "/placeholder.svg?height=40&width=40",
        },
      ],
      files: [],
    },
  ],
};
