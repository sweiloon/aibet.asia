import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Define translation resources
const resources = {
  en: {
    translation: {
      // Dashboard Header
      "Administrator Dashboard": "Administrator Dashboard",
      "User Dashboard": "User Dashboard",
      "Switch to Chinese": "中文",
      "Switch to English": "English",
      WhatsApp: "WhatsApp",

      // Admin Dashboard Page
      "Admin Dashboard": "Admin Dashboard",
      "Manage all websites and user accounts":
        "Manage all websites and user accounts",
      "Total Websites": "Total Websites",
      "Website Submission": "Website Submission",
      "ID Card Submission": "ID Card Submission",
      "Bank Submission": "Bank Submission",
      "View All": "View All",
      "Pending Websites": "Pending Websites",
      "Review Pending": "Review Pending",
      "Active Websites": "Active Websites",
      "View Active": "View Active",

      // Admin PendingApprovalsCard
      "Pending Approvals": "Pending Approvals",
      "Websites that need your review": "Websites that need your review",
      "Added on": "Added on", // For "Added {date}"
      Review: "Review",
      "View All ({{count}}) Pending Websites":
        "View All ({{count}}) Pending Websites",
      "No pending websites": "No pending websites",
      "All websites have been reviewed": "All websites have been reviewed",

      // Admin RecentManagementCard
      "Recent Management Records": "Recent Management Records",
      "Latest website management activities":
        "Latest website management activities",
      "Updated on": "Updated on", // For "Updated {date}"
      Details: "Details",
      tasks_completed_status: "/{{totalTasks}} tasks completed", // Using a more descriptive key
      "View All Active Websites": "View All Active Websites",
      "No management records yet": "No management records yet",
      "Add management records to approved websites":
        "Add management records to approved websites",

      // Admin Websites Page
      "Manage Websites": "Manage Websites",
      "Review and manage all websites in the system":
        "Review and manage all websites in the system",
      "Search by name, URL, status, or user email...":
        "Search by name, URL, status, or user email...",
      Name: "Name",
      URL: "URL",
      Status: "Status",
      User: "User",
      Submitted: "Submitted",
      Records: "Records",
      Actions: "Actions",
      Approved: "Approved",
      Rejected: "Rejected",
      Pending: "Pending",
      Manage: "Manage",
      "This document submission does not have management records.":
        "This document submission does not have management records.",
      "This website is rejected. No records available.":
        "This website is rejected. No records available.",
      "No websites found matching your search":
        "No websites found matching your search",
      "Clear search": "Clear search",

      // User Dashboard - WelcomeHeader
      "Welcome to Your Dashboard": "Welcome to Your Dashboard",
      "Manage and monitor your websites": "Manage and monitor your websites",
      "Upload Website": "Upload Website",

      // User Dashboard - StatisticsCards
      "All websites submitted to our platform":
        "All websites submitted to our platform",
      "Websites currently under active management":
        "Websites currently under active management",
      "Pending Approval": "Pending Approval",
      "Websites waiting for admin approval":
        "Websites waiting for admin approval",

      // User Dashboard - ManagementRecords
      "Date:": "Date:",
      Completed: "Completed", // For task status
      "In Progress": "In Progress", // For task status
      "Day:": "Day:",
      "Credit:": "Credit:",
      "Profit:": "Profit:",
      "Gross Profit:": "Gross Profit:",
      "Service Fee:": "Service Fee:",
      "Start Date:": "Start Date:",
      "End Date:": "End Date:",
      "Net Profit:": "Net Profit:",
      "View All Records": "View All Records",
      "No management records available yet.":
        "No management records available yet.",
      "Management records will appear once our team starts working on your websites.":
        "Management records will appear once our team starts working on your websites.",
      "No approved websites yet": "No approved websites yet",
      "Submit your websites for approval to see management records here.":
        "Submit your websites for approval to see management records here.",
      "Invalid Date": "Invalid Date",

      // Shared Sidebar
      AI: "AI", // Could be a brand name, or abbreviation for Artificial Intelligence
      Navigation: "Navigation",
      Account: "Account",
      Logout: "Logout",
      "Logged in as {{email}}": "Logged in as {{email}}",
      Customer: "Customer", // User Ranking
      Agent: "Agent", // User Ranking
      Master: "Master", // User Ranking
      Senior: "Senior", // User Ranking

      // User Sidebar Items
      Dashboard: "Dashboard",
      "Upload History": "Upload History",
      "Website Records": "Website Records",
      "Upload Document": "Upload Document",

      // Admin Sidebar Items
      Websites: "Websites",
      Approvals: "Approvals",

      // Account Sidebar Items (Shared but some only for Admin)
      Settings: "Settings",
      "User Management": "User Management", // Admin only

      // User WebsiteAdd Page
      "Submit a new website for management":
        "Submit a new website for management",
      "Website Details": "Website Details",
      "Fill in the details of the website you want us to manage":
        "Fill in the details of the website you want us to manage",
      "Website Name": "Website Name",
      "My Company Website": "My Company Website", // Placeholder
      "Website URL": "Website URL",
      "www.example.com": "www.example.com", // Placeholder
      "Admin Username": "Admin Username",
      admin: "admin", // Placeholder
      "Admin Password": "Admin Password",
      "Confirm Password": "Confirm Password",
      "Passwords do not match": "Passwords do not match",
      "Please enter a valid URL": "Please enter a valid URL",
      "Your credentials are securely stored and only used for management purposes.":
        "Your credentials are securely stored and only used for management purposes.",
      Cancel: "Cancel",
      "Submitting...": "Submitting...",
      "Submit Website": "Submit Website",
      "Website submitted successfully": "Website submitted successfully", // Toast
      "Failed to submit website": "Failed to submit website", // Toast

      // User UploadHistory Page
      "View all your previous upload submissions":
        "View all your previous upload submissions",
      All: "All", // Tab name
      "Approved On": "Approved On", // Table title
      "Submitted On": "Submitted On", // Table title - also used as table header in AdminWebsites
      "Rejected On": "Rejected On", // Table title
      "Download Files": "Download Files",
      Download: "Download",

      // UploadHistoryTable Component (User Dashboard)
      Type: "Type",
      Website: "Website",
      Document: "Document",
      "ID Card": "ID Card",
      "Bank Statement": "Bank Statement",
      "No {{type}} found": "No {{type}} found",
      "upload history": "upload history",

      // UploadDetailsDialog Component (User Dashboard)
      "Submission Details": "Submission Details",
      "Details for your submitted item": "Details for your submitted item",
      "Delete Submission": "Delete Submission",
      "Are you sure you want to delete this submission? This action cannot be undone.":
        "Are you sure you want to delete this submission? This action cannot be undone.",
      Delete: "Delete", // For delete button in dialog
      "Date Submitted": "Date Submitted",
      "Login Credentials": "Login Credentials",
      Files: "Files",
      "Download Image": "Download Image",
      "Download File": "Download File",
      "No files available or files are not in the correct format.":
        "No files available or files are not in the correct format.",
      "Rejection Reason": "Rejection Reason",
      Resubmit: "Resubmit",

      // User WebsiteRecords Page
      "Search websites...": "Search websites...", // Placeholder
      "You don't have any approved websites yet":
        "You don't have any approved websites yet",
      Day: "Day", // Table Header
      "Login URL": "Login URL",
      Close: "Close",

      // User UploadDocument Page
      "Upload your ID card or bank statement for verification":
        "Upload your ID card or bank statement for verification",

      // IdCardUpload Component (User Dashboard)
      "Upload ID Card": "Upload ID Card",
      "Please upload both front and back images of your ID card":
        "Please upload both front and back images of your ID card",
      "ID Card Front": "ID Card Front",
      "ID Card Back": "ID Card Back",
      "Submit ID Card": "Submit ID Card",
      "Front ID Image Required": "Front ID Image Required", // Toast
      "Please upload a front image of your ID card.":
        "Please upload a front image of your ID card.", // Toast
      "Back ID Image Required": "Back ID Image Required", // Toast
      "Please upload a back image of your ID card.":
        "Please upload a back image of your ID card.", // Toast
      "ID Card Submission": "ID Card Submission", // Internal name for submission
      "ID Card Submitted": "ID Card Submitted", // Toast
      "Your ID card has been successfully submitted for review.":
        "Your ID card has been successfully submitted for review.", // Toast
      "There was a problem uploading your ID card images.":
        "There was a problem uploading your ID card images.", // Toast
      "Click to upload {{label}} image": "Click to upload {{label}} image",
      "Browse Files": "Browse Files",

      // BankStatementUpload Component (User Dashboard)
      "Upload Bank Statement": "Upload Bank Statement",
      "Please upload your bank statement documents (PDF format)":
        "Please upload your bank statement documents (PDF format)",
      "Click to upload PDF files": "Click to upload PDF files",
      "Selected Files": "Selected Files",
      "Submit Bank Statement": "Submit Bank Statement",
      "Bank Statement Required": "Bank Statement Required", // Toast
      "Please upload at least one bank statement.":
        "Please upload at least one bank statement.", // Toast
      "Bank Statement Submission": "Bank Statement Submission", // Internal name
      "Bank Statement Submitted": "Bank Statement Submitted", // Toast
      "Your bank statement has been successfully submitted for review.":
        "Your bank statement has been successfully submitted for review.", // Toast
      "There was a problem submitting your bank statement.":
        "There was a problem submitting your bank statement.", // Toast

      // User Settings Page
      "Manage your account settings": "Manage your account settings",
      "Account Information": "Account Information",
      "Your basic account details": "Your basic account details",
      Email: "Email",
      Role: "Role",
      "Change Password": "Change Password",
      "Change Password Feature Coming Soon":
        "Change Password Feature Coming Soon",
      "Password updated successfully! Please login again with your new password.":
        "Password updated successfully! Please login again with your new password.", // Toast
      Admin: "Admin", // User Role

      // Admin Approvals Page
      "Approval Requests": "Approval Requests",
      "Review and manage website and document submissions":
        "Review and manage website and document submissions",
      "Search requests...": "Search requests...", // Placeholder
      "Item approved": "Item approved", // Toast
      "The item has been approved.": "The item has been approved.", // Toast
      "Item rejected": "Item rejected", // Toast
      "The item has been rejected.": "The item has been rejected.", // Toast
      "Date Approved": "Date Approved", // Table title for ApprovalsTable
      "Date Rejected": "Date Rejected", // Table title for ApprovalsTable

      // Admin ItemDetailsDialog Component
      "Full details for the submission": "Full details for the submission",

      // Admin WebsiteRecords Page
      "Search by website name or user email...":
        "Search by website name or user email...",
      "No approved websites found": "No approved websites found",
      "Add Management Record": "Add Management Record", // Dialog Title
      "Record added successfully": "Record added successfully", // Toast
      "{{field}} updated successfully": "{{field}} updated successfully", // Toast
      "Record deleted successfully": "Record deleted successfully", // Toast
      "There are no records to clear for this website.":
        "There are no records to clear for this website.", // Toast
      "All records cleared successfully": "All records cleared successfully", // Toast

      // Admin WebsiteRecordCard Component
      "Clear Records": "Clear Records",
      "Add Day": "Add Day",
      "Delete Record": "Delete Record", // Dialog Title
      "Are you sure you want to delete this record? This action cannot be undone.":
        "Are you sure you want to delete this record? This action cannot be undone.",
      "Clear all records": "Clear all records", // Dialog Title
      "Are you sure you want to clear all records for this website? This action cannot be undone.":
        "Are you sure you want to clear all records for this website? This action cannot be undone.",
      "Delete All Records": "Delete All Records", // Dialog Action

      // Admin WebsiteDetailsDialog Component
      "User Email": "User Email", // Label

      // Admin EditFieldDialog Component
      "Edit {{field}}": "Edit {{field}}", // Dialog Title
      Value: "Value", // Label
      // "Cancel": "Cancel", // Reusing
      Update: "Update", // Button

      // Admin Users (User Management) Page
      "View and manage users of the platform":
        "View and manage users of the platform",
      "Loading users...": "Loading users...",
      "Failed to load users": "Failed to load users",
      "Search by email or name...": "Search by email or name...",
      Joined: "Joined",
      "Day Count": "Day Count",
      Ranking: "Ranking",
      active: "active", // User status
      inactive: "inactive", // User status
      "Edit user": "Edit user", // Button title
      "Delete user": "Delete user", // Button title
      "No users found.": "No users found.",
      "Delete User": "Delete User", // Dialog Title
      "Are you sure you want to delete this user? This action cannot be undone.":
        "Are you sure you want to delete this user? This action cannot be undone.", // Dialog Description
      "User deleted": "User deleted", // Toast
      "The user has been successfully deleted.":
        "The user has been successfully deleted.", // Toast
      "Failed to delete user. Please try again.":
        "Failed to delete user. Please try again.", // Toast
      "Status updated": "Status updated", // Toast
      "User status changed to {{newStatus}}.":
        "User status changed to {{newStatus}}.", // Toast
      "Failed to update user status. Please try again.":
        "Failed to update user status. Please try again.", // Toast

      // Admin EditUserDialog Component
      "Invalid email address": "Invalid email address", // Zod
      "Password must be at least 6 characters":
        "Password must be at least 6 characters", // Zod
      // "Passwords do not match": "Passwords do not match", // Zod - Reusing
      // "Edit User": "Edit User", // Dialog Title - Reusing
      "Update the user's details and permissions. Only changed fields will be updated.":
        "Update the user's details and permissions. Only changed fields will be updated.",
      // "Name": "Name", // FormLabel - Reusing
      "User name": "User name", // Placeholder
      // "Email": "Email", // FormLabel - Reusing
      // "email@example.com": "email@example.com", // Placeholder - Reusing
      // "Role": "Role", // FormLabel - Reusing
      "Select role": "Select role", // Placeholder
      // "User": "User", // SelectItem - Reusing
      // "Admin": "Admin", // SelectItem - Reusing
      // "Ranking": "Ranking", // FormLabel - Reusing
      "Select ranking": "Select ranking", // Placeholder
      // "Customer", "Agent", "Master", "Senior" - SelectItems - Reusing
      // "Status": "Status", // FormLabel - Reusing
      "Select status": "Select status", // Placeholder
      // "active", "inactive" - SelectItems - Reusing keys "active", "inactive"
      // "Change Password": "Change Password", // Section Title - Reusing
      "Leave blank to keep the current password":
        "Leave blank to keep the current password",
      "New Password": "New Password",
      // "Confirm Password": "Confirm Password", // FormLabel - Reusing
      // "Cancel": "Cancel", // Button - Reusing
      "Saving...": "Saving...", // Button
      "Save changes": "Save changes", // Button
      "User updated": "User updated", // Toast
      "User details have been successfully updated.":
        "User details have been successfully updated.", // Toast
      "Failed to update user. Please try again.":
        "Failed to update user. Please try again.", // Toast
      "editUserDialog.title": "Edit User",
      "editUserDialog.description":
        "Update the user's details and permissions. Only changed fields will be updated.",
      "editUserDialog.nameLabel": "Name",
      "editUserDialog.emailLabel": "Email",
      "editUserDialog.roleLabel": "Role",
      "editUserDialog.rankingLabel": "Ranking",
      "editUserDialog.statusLabel": "Status",
      "editUserDialog.cancelButton": "Cancel",

      // Admin Settings Page
      "Admin Settings": "Admin Settings",
      "Manage your admin account settings":
        "Manage your admin account settings",
      "Your admin account details": "Your admin account details",
      // Add more translations here as needed

      // Sidebar User Info
      "sidebar.signupDate": "Sign up date: {{date}}",
      "sidebar.activeDay": "Active days: {{days}}",
    },
  },
  zh: {
    translation: {
      // Dashboard Header
      "Administrator Dashboard": "管理员仪表板",
      "User Dashboard": "用户仪表板",
      "Switch to Chinese": "中文",
      "Switch to English": "English",
      WhatsApp: "WhatsApp", // Assuming WhatsApp branding remains

      // Admin Dashboard Page
      "Admin Dashboard": "管理员仪表板",
      "Manage all websites and user accounts": "管理所有网站和用户帐户",
      "Total Websites": "总网站数",
      "Website Submission": "网站提交",
      "ID Card Submission": "身份证提交",
      "Bank Submission": "银行提交",
      "View All": "查看全部",
      "Pending Websites": "待处理网站",
      "Review Pending": "审核待处理",
      "Active Websites": "活跃网站",
      "View Active": "查看活跃网站",

      // Admin PendingApprovalsCard
      "Pending Approvals": "待审批",
      "Websites that need your review": "需要您审核的网站",
      "Added on": "添加于", // For "Added {date}"
      Review: "审核",
      "View All ({{count}}) Pending Websites":
        "查看全部 ({{count}}) 个待处理网站",
      "No pending websites": "无待处理网站",
      "All websites have been reviewed": "所有网站均已审核",

      // Admin RecentManagementCard
      "Recent Management Records": "近期管理记录",
      "Latest website management activities": "最新的网站管理活动",
      "Updated on": "更新于", // For "Updated {date}"
      Details: "详情",
      tasks_completed_status: "/{{totalTasks}} 个任务已完成",
      "View All Active Websites": "查看所有活跃网站",
      "No management records yet": "尚无管理记录",
      "Add management records to approved websites":
        "向已批准的网站添加管理记录",

      // Admin Websites Page
      "Manage Websites": "管理网站",
      "Review and manage all websites in the system":
        "审核和管理系统中的所有网站",
      "Search by name, URL, status, or user email...":
        "按名称、URL、状态或用户邮箱搜索...",
      Name: "名称",
      URL: "链接",
      Status: "状态",
      User: "用户",
      Submitted: "提交于",
      Records: "记录",
      Actions: "操作",
      Approved: "已批准",
      Rejected: "已拒绝",
      Pending: "待处理",
      Manage: "管理",
      "This document submission does not have management records.":
        "此文档提交没有管理记录。",
      "This website is rejected. No records available.":
        "该网站已被拒绝。没有可用的记录。",
      "No websites found matching your search": "未找到与您的搜索匹配的网站",
      "Clear search": "清除搜索",

      // User Dashboard - WelcomeHeader
      "Welcome to Your Dashboard": "欢迎来到您的仪表板",
      "Manage and monitor your websites": "管理和监控您的网站",
      "Upload Website": "上传网站",

      // User Dashboard - StatisticsCards
      "All websites submitted to our platform": "所有提交到我们平台的网站",
      "Websites currently under active management": "当前正在积极管理的网站",
      "Pending Approval": "待批准",
      "Websites waiting for admin approval": "等待管理员批准的网站",

      // User Dashboard - ManagementRecords
      "Date:": "日期：",
      Completed: "已完成", // For task status
      "In Progress": "进行中", // For task status
      "Day:": "天：",
      "Credit:": "信用额度：",
      "Profit:": "利润：",
      "Gross Profit:": "毛利润：",
      "Service Fee:": "服务费：",
      "Start Date:": "开始日期：",
      "End Date:": "结束日期：",
      "Net Profit:": "净利润：",
      "View All Records": "查看所有记录",
      "No management records available yet.": "尚无管理记录。",
      "Management records will appear once our team starts working on your websites.":
        "我们的团队开始处理您的网站后，管理记录即会显示。",
      "No approved websites yet": "尚无已批准的网站",
      "Submit your websites for approval to see management records here.":
        "提交您的网站以供批准，即可在此处查看管理记录。",
      "Invalid Date": "无效日期",

      // Shared Sidebar
      AI: "智能", // Or keep as AI if it's a brand element
      Navigation: "导航",
      Account: "账户",
      Logout: "登出",
      "Logged in as {{email}}": "登录身份：{{email}}",
      Customer: "客户", // User Ranking
      Agent: "代理", // User Ranking
      Master: "大师", // User Ranking
      Senior: "高级", // User Ranking

      // User Sidebar Items
      Dashboard: "仪表板",
      "Upload History": "上传历史",
      "Website Records": "网站记录",
      "Upload Document": "上传文件",

      // Admin Sidebar Items
      Websites: "网站",
      Approvals: "审批",

      // Account Sidebar Items (Shared but some only for Admin)
      Settings: "设置",
      "User Management": "用户管理", // Admin only

      // User WebsiteAdd Page
      "Submit a new website for management": "提交一个新网站以供管理",
      "Website Details": "网站详情",
      "Fill in the details of the website you want us to manage":
        "填写您希望我们管理的网站的详细信息",
      "Website Name": "网站名称",
      "My Company Website": "我的公司网站", // Placeholder
      "Website URL": "网站URL",
      "www.example.com": "www.example.com", // Placeholder - often kept as is
      "Admin Username": "管理员用户名",
      admin: "admin", // Placeholder - often kept as is
      "Admin Password": "管理员密码",
      "Confirm Password": "确认密码",
      "Passwords do not match": "密码不匹配",
      "Please enter a valid URL": "请输入有效的URL",
      "Your credentials are securely stored and only used for management purposes.":
        "您的凭据已安全存储，仅用于管理目的。",
      Cancel: "取消",
      "Submitting...": "提交中...",
      "Submit Website": "提交网站",
      "Website submitted successfully": "网站提交成功", // Toast
      "Failed to submit website": "提交网站失败", // Toast

      // User UploadHistory Page
      "View all your previous upload submissions":
        "查看您之前所有的上传提交记录",
      All: "全部", // Tab name
      "Approved On": "批准于", // Table title
      "Submitted On": "提交于", // Table title - also used as table header in AdminWebsites
      "Rejected On": "拒绝于", // Table title
      "Download Files": "下载文件",
      Download: "下载",

      // UploadHistoryTable Component (User Dashboard)
      Type: "类型",
      Website: "网站",
      Document: "文件",
      "ID Card": "身份证",
      "Bank Statement": "银行流水",
      "No {{type}} found": "未找到{{type}}",
      "upload history": "上传记录",

      // UploadDetailsDialog Component (User Dashboard)
      "Submission Details": "提交详情",
      "Details for your submitted item": "您提交项目详情",
      "Delete Submission": "删除提交",
      "Are you sure you want to delete this submission? This action cannot be undone.":
        "您确定要删除此提交吗？此操作无法撤销。",
      Delete: "删除", // For delete button in dialog
      "Date Submitted": "提交日期",
      "Login Credentials": "登录凭据",
      Files: "文件",
      "Download Image": "下载图片",
      "Download File": "下载文件",
      "No files available or files are not in the correct format.":
        "无可用文件或文件格式不正确。",
      "Rejection Reason": "拒绝原因",
      Resubmit: "重新提交",

      // User WebsiteRecords Page
      "Search websites...": "搜索网站...", // Placeholder
      "You don't have any approved websites yet": "您还没有任何已批准的网站",
      Day: "天", // Table Header
      "Login URL": "登录URL",
      Close: "关闭",

      // User UploadDocument Page
      "Upload your ID card or bank statement for verification":
        "上传您的身份证或银行流水以进行验证",

      // IdCardUpload Component (User Dashboard)
      "Upload ID Card": "上传身份证",
      "Please upload both front and back images of your ID card":
        "请上传您身份证的正反面图片",
      "ID Card Front": "身份证正面",
      "ID Card Back": "身份证反面",
      "Submit ID Card": "提交身份证",
      "Front ID Image Required": "需要身份证正面图片", // Toast
      "Please upload a front image of your ID card.":
        "请上传您身份证的正面图片。", // Toast
      "Back ID Image Required": "需要身份证反面图片", // Toast
      "Please upload a back image of your ID card.":
        "请上传您身份证的反面图片。", // Toast
      "ID Card Submission": "身份证提交", // Internal name for submission
      "ID Card Submitted": "身份证已提交", // Toast
      "Your ID card has been successfully submitted for review.":
        "您的身份证已成功提交以供审核。", // Toast
      "There was a problem uploading your ID card images.":
        "上传您的身份证图片时出现问题。", // Toast
      "Click to upload {{label}} image": "点击上传 {{label}} 图片",
      "Browse Files": "浏览文件",

      // BankStatementUpload Component (User Dashboard)
      "Upload Bank Statement": "上传银行流水",
      "Please upload your bank statement documents (PDF format)":
        "请上传您的银行流水文件 (PDF格式)",
      "Click to upload PDF files": "点击上传 PDF 文件",
      "Selected Files": "已选择文件",
      "Submit Bank Statement": "提交银行流水",
      "Bank Statement Required": "需要银行流水", // Toast
      "Please upload at least one bank statement.": "请至少上传一份银行流水。", // Toast
      "Bank Statement Submission": "银行流水提交", // Internal name
      "Bank Statement Submitted": "银行流水已提交", // Toast
      "Your bank statement has been successfully submitted for review.":
        "您的银行流水已成功提交以供审核。", // Toast
      "There was a problem submitting your bank statement.":
        "提交您的银行流水时出现问题。", // Toast

      // User Settings Page
      "Manage your account settings": "管理您的帐户设置",
      "Account Information": "帐户信息",
      "Your basic account details": "您的基本帐户详细信息",
      Email: "电子邮件",
      Role: "角色",
      "Change Password": "更改密码",
      "Change Password Feature Coming Soon": "更改密码功能即将推出",
      "Password updated successfully! Please login again with your new password.":
        "密码更新成功！请使用新密码重新登录。", // Toast
      Admin: "管理员", // User Role

      // Admin Approvals Page
      "Approval Requests": "审批请求",
      "Review and manage website and document submissions":
        "审核和管理网站及文件提交",
      "Search requests...": "搜索请求...", // Placeholder
      "Item approved": "项目已批准", // Toast
      "The item has been approved.": "该项目已被批准。", // Toast
      "Item rejected": "项目已拒绝", // Toast
      "The item has been rejected.": "该项目已被拒绝。", // Toast
      "Date Approved": "批准日期", // Table title for ApprovalsTable
      "Date Rejected": "拒绝日期", // Table title for ApprovalsTable

      // Admin ItemDetailsDialog Component
      "Full details for the submission": "提交的完整详情",

      // Admin WebsiteRecords Page
      "Search by website name or user email...": "按网站名称或用户邮箱搜索...",
      "No approved websites found": "未找到已批准的网站",
      "Add Management Record": "添加管理记录", // Dialog Title
      "Record added successfully": "记录添加成功", // Toast
      "{{field}} updated successfully": "{{field}} 更新成功", // Toast
      "Record deleted successfully": "记录删除成功", // Toast
      "There are no records to clear for this website.":
        "此网站没有可清除的记录。", // Toast
      "All records cleared successfully": "所有记录清除成功", // Toast

      // Admin WebsiteRecordCard Component
      "Clear Records": "清除记录",
      "Add Day": "添加天数",
      "Delete Record": "删除记录", // Dialog Title
      "Are you sure you want to delete this record? This action cannot be undone.":
        "您确定要删除此记录吗？此操作无法撤销。",
      "Clear all records": "清除所有记录", // Dialog Title
      "Are you sure you want to clear all records for this website? This action cannot be undone.":
        "您确定要清除此网站的所有记录吗？此操作无法撤销。",
      "Delete All Records": "删除所有记录", // Dialog Action

      // Admin WebsiteDetailsDialog Component
      "User Email": "用户邮箱", // Label

      // Admin EditFieldDialog Component
      "Edit {{field}}": "编辑 {{field}}", // Dialog Title
      Value: "值", // Label
      // "Cancel": "取消", // Reusing
      Update: "更新", // Button

      // Admin Users (User Management) Page
      "View and manage users of the platform": "查看和管理平台用户",
      "Loading users...": "加载用户中...",
      "Failed to load users": "加载用户失败",
      "Search by email or name...": "按邮箱或名称搜索...",
      Joined: "加入于",
      "Day Count": "天数统计",
      Ranking: "排行",
      active: "活跃", // User status
      inactive: "不活跃", // User status
      "Edit user": "编辑用户", // Button title
      "Delete user": "删除用户", // Button title
      "No users found.": "未找到用户。",
      "Delete User": "删除用户", // Dialog Title
      "Are you sure you want to delete this user? This action cannot be undone.":
        "您确定要删除此用户吗？此操作无法撤销。",
      "User deleted": "用户已删除", // Toast
      "The user has been successfully deleted.": "用户已成功删除。", // Toast
      "Failed to delete user. Please try again.": "删除用户失败。请再试一次。", // Toast
      "Status updated": "状态已更新", // Toast
      "User status changed to {{newStatus}}.":
        "用户状态已更改为 {{newStatus}}。", // Toast
      "Failed to update user status. Please try again.":
        "更新用户状态失败。请再试一次。", // Toast

      // Admin EditUserDialog Component
      "Invalid email address": "无效的邮箱地址", // Zod
      "Password must be at least 6 characters": "密码必须至少包含6个字符", // Zod
      // "Passwords do not match": "密码不匹配", // Zod - Reusing
      // "Edit User": "编辑用户", // Dialog Title - Reusing
      "Update the user's details and permissions. Only changed fields will be updated.":
        "更新用户的详细信息和权限。只有更改过的字段才会被更新。",
      // "Name": "名称", // FormLabel - Reusing
      "User name": "用户名", // Placeholder
      // "Email": "电子邮件", // FormLabel - Reusing
      // "email@example.com": "邮箱@example.com", // Placeholder - Reusing
      // "Role": "角色", // FormLabel - Reusing
      "Select role": "选择角色", // Placeholder
      // "User": "用户", // SelectItem - Reusing
      // "Admin": "管理员", // SelectItem - Reusing
      // "Ranking": "排行", // FormLabel - Reusing
      "Select ranking": "选择排行", // Placeholder
      // "Customer", "Agent", "Master", "Senior" - SelectItems - Reusing
      // "Status": "状态", // FormLabel - Reusing
      "Select status": "选择状态", // Placeholder
      // "active", "inactive" - SelectItems - Reusing keys "active", "inactive"
      // "Change Password": "更改密码", // Section Title - Reusing
      "Leave blank to keep the current password": "留空以保留当前密码",
      "New Password": "新密码",
      // "Confirm Password": "确认密码", // FormLabel - Reusing
      // "Cancel": "取消", // Button - Reusing
      "Saving...": "保存中...", // Button
      "Save changes": "保存更改", // Button
      "User updated": "用户已更新", // Toast
      "User details have been successfully updated.":
        "用户详细信息已成功更新。", // Toast
      "Failed to update user. Please try again.": "更新用户失败。请再试一次。", // Toast
      "editUserDialog.title": "Edit User",
      "editUserDialog.description":
        "Update the user's details and permissions. Only changed fields will be updated.",
      "editUserDialog.nameLabel": "Name",
      "editUserDialog.emailLabel": "Email",
      "editUserDialog.roleLabel": "Role",
      "editUserDialog.rankingLabel": "Ranking",
      "editUserDialog.statusLabel": "Status",
      "editUserDialog.cancelButton": "Cancel",

      // Admin Settings Page
      "Admin Settings": "管理员设置",
      "Manage your admin account settings": "管理您的管理员帐户设置",
      "Your admin account details": "您的管理员帐户详细信息",
      // Add more translations here as needed

      // Sidebar User Info
      "sidebar.signupDate": "注册日期：{{date}}",
      "sidebar.activeDay": "活跃天数：{{days}}",
    },
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Use English if detected language is not available
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ["localStorage", "navigator"], // Order to detect language
      caches: ["localStorage"], // Cache detected language in localStorage
    },
  });

export default i18n;
