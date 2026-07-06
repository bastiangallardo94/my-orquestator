export default {
	pages: {
		inspectionScheduling: 'Inspection Scheduling',
		scheduleApproval: 'Schedule Approval',
		inspectionSchedulingPreparation: 'Inspection Scheduling Preparation'
	},
	common: {
		images: 'Images',
		required: 'Required',
		continue: 'Continue',
		status: 'Status',
		refuse: 'Refuse',
		accept: 'Accept',
		result: 'Result',
		comment: 'Comment',
		manageImages: 'Manage images',
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',
		save: 'Save',
		cancel: 'Cancel',
		delete: 'Delete',
		edit: 'Edit',
		add: 'Add',
		search: 'Search',
		filter: 'Filter',
		export: 'Export',
		import: 'Import',
		close: 'Close',
		open: 'Open',
		confirm: 'Confirm',
		reset: 'Reset',
		yes: 'Yes',
		no: 'No',
		back: 'Back',
		next: 'Next',
		previous: 'Previous',
		reload: 'Reload',
		notAvailable: 'Not available',
		accessDenied: 'Access Denied',
		accessDeniedMessage: 'You do not have the necessary permissions to access this page.',
		requiredRoles: 'Required roles:',
		goBack: 'Go Back',
		goHome: 'Go to Home',
		accessDeniedHelp: 'If you believe this is an error, please contact your system administrator.',
		developedBy: 'Developed by Imports team',
		noData: 'Filter data to display content.',
		errorLoading: 'An error occured fetching the data.',
		noDataFound: 'No data was found.',
		found: 'found',
		description: 'Description',
		home: 'Home',
		style: 'Style',
		sku: 'SKU',
		inspection: 'Inspection',
		purchaseOrder: 'Purchase Order',
		download: 'Download',
		noFilesUploaded: 'No files uploaded'
	},
	errors: {
		generic: 'An error has occurred',
		network: 'Connection error',
		unauthorized: 'Unauthorized',
		forbidden: 'Access denied',
		notFound: 'Not found',
		serverError: 'Server error',
		validation: 'Validation error',
		required: 'This field is required',
		invalidFormat: 'Invalid format'
	},
	portal: {
		country: 'Country',
		businessUnit: 'Business Unit',
		notSelected: 'Not selected'
	},
	menuData: {
		template: 'Template',
		home: 'Home',
		example: 'Example',
		about: 'About',
		admin: 'Admin'
	},
	home: {
		title: 'Inspections',
		description: 'This platform allows the scheduling and management of your pre-shipment inspections.',
		scheduling: {
			title: 'Inspection Scheduling',
			description: 'Take a look at the Purchase Orders and Styles ready for scheduling.'
		},
		results: {
			title: 'Inspection Results',
			description: 'Review the results of the inspections.'
		},
		mySchedule: {
			'title': 'My inspection requests',
			'description': 'Review inspection scheduling requests and manage their approval or rejection.'
		},
		inspector: {
			title: 'My inspections (inspector)',
			description: 'Review the inspections you have been assigned to carry out, as well as the history of those already completed.'
		},
		schedule_approval: {
			title: 'My Inspection Requests',
			description: 'Review inspection scheduling requests and manage their approval or rejection.'
		},
		inspection_management: {
			title: 'Inspection Management',
			description: 'Review and manage inspections grouped by purchase order.'
		}
	},
	inspection_management: {
		title: ' Inspection Management',
		description: 'Review and manage inspections grouped by purchase order.',
		table_placeholder: 'PO/Details table — pending definition with FSS-5297',
		exceptions_button: 'Inspection Exceptions',
		reason_label: 'Reason',
		reason_required_blacklist: 'required for Blacklist',
		reason_placeholder: 'Enter the exception reason',
		blacklist_button: 'Force Inspection (Blacklist)',
		whitelist_button: 'Release Inspection (Whitelist)',
		see_details: 'See details',
		items_selected: 'item(s) selected',
		table: {
			po: 'PO',
			folder: 'Folder',
			bu: 'BU',
			country: 'Country',
			vendor: 'Vendor Corp',
			col: 'COL',
			crd: 'CRD'
		},
		summary: {
			title_ok: 'Process completed successfully',
			title_error: 'Errors found in the process',
			processed: 'Processed',
			errors: 'Errors',
			tab_ok: 'Processed OK',
			tab_error: 'Errors',
			finish_button: 'Finish',
			no_items: 'No items to display',
			breadcrumb: 'Summary',
			col_oc: 'Purchase Order',
			col_inspection: 'Inspection Type',
			col_action: 'Action',
			col_sku_style: 'SKU/Style',
			col_description: 'Description',
			col_folder: 'Folder',
			col_reason: 'Reason',
			col_error_reason: 'Result',
			col_detail: 'Detail',
			col_inspection_type: 'Inspection Type',
			col_state: 'Updated status',
			col_error: 'Error reason',
			download_msg: 'Download the error summary to fix and reload',
			download_button: 'Download Summary',
			file_max_error: 'Only one file is allowed',
			file_extension_error: 'Format not allowed. Use CSV, XLS or XLSX',
			file_size_error: 'File exceeds maximum size of 10MB',
			upload_label: 'Drag the corrected file here, or click to select',
			upload_desc: 'Supported formats: CSV, XLS, XLSX. Maximum 10MB.'
		},
		bulk: {
			breadcrumb: 'Bulk Exception',
			title: 'Bulk selection of purchase orders',
			description: 'To make a bulk selection of POs, upload an Excel template with a list of the purchase orders you want to include in the appointment.',
			upload_label: 'Drag the file here, or click to browse',
			upload_desc: 'Supported formats: CSV, XLS, XLSX. Maximum size: 10mb.',
			steps: {
				one: {
					title: 'Step 1',
					description: 'D'
				}
			}
		}
	},
	card: {
		template: 'Pre-shipment Inspections'
	},
	scheduling: {
		title: 'Inspection Scheduling',
		navigation: 'Inspection Scheduling Navigation',
		description:
			'This module allows you to request inspection scheduling, track the status of each request, and view the results of completed inspections.',
		purchaseOrders: 'Purchase Orders',
		pendingOrders: 'Pending Orders',
		scheduledInspections: 'Scheduled Inspections',
		bu: 'Business Unit',
		vendor: 'Vendor',
		destCountry: 'Country of Destination',
		country: 'Country',
		poNumber: 'PO Number',
		folderNumber: 'Folder Number',
		status: 'Status',
		proformaInvoice: 'Proforma Invoice',
		crd: 'Cargo Ready Date',
		stage: 'Stage',
		poStage: 'Purchase Order Stage',
		inspectionStatus: 'Inspection Status',
		style: 'Style',
		styles: 'See styles',
		skus: 'See SKUs',
		inspectionTypes: 'Inspection Types',
		inspectionType: 'Inspection Type',
		inspectionDay: 'Inspection Day',
		stageStatus: 'Stage Status',
		inspector: 'Inspector',
		inspectorID: 'Inspector ID',
		inspectorCompany: 'Inspector Company',
		purchaseOrdersPage: {
			found: 'Purchase Orders found'
		},
		inspectionCode: 'Inspection Code'
	},
	inspection: {
		summary: 'Inspection request summary',
		breadcrumbReq: 'Inspection request',
		breadcrumbRes: 'Inspection result',
		selectedOrders: 'Selected orders',
		date: 'Requested inspection date',
		facility: 'Facility',
		address: 'Address',
		prepSummary: 'Preparation summary',
		notify: '¿Do you want to be notified at your email',
		returnToSchedule: 'Return to schedule',
		returnToInspections: 'Return to inspections',
		cancelRequest: 'Cancel request',
		downloadSummary: 'Download summary',
		editRequest: 'Edit request',
		titleApproved: 'The inspection was approved',
		titleRejected: 'The inspection was rejected',
		titleProcessing: 'The inspection is under review',
		titlePartiallyApproved: 'The inspection was partially approved',
		titleRequestConfirmed: 'The inspection request has been confirmed',
		titleRequestUnderReview: 'The inspection request is under review',
		titleRequestRejected: 'The inspection request has been rejected',
		result: 'Inspection result',
		type: 'Inspection type',
		addToCalendar: 'Add to calendar',
		excel: 'Download Excel',
		addEmail: 'Add another email',
		rejectDescription: 'Review the reason for rejection, correct it, and request a new appointment.',
		modal: {
			title: 'Are you sure you want to cancel the inspection scheduling request?',
			description: 'If you cancel the request, you can submit it again by searching for the style in \'Pending Orders\'.',
			reason: 'Reason for cancellation (optional)',
			confirm: 'Confirm cancellation'
		},
		found: 'inspections found',
		obs: 'Observations',
		obsApproved: 'The inspection was approved, but it is recommended to review the following points:',
		obsRejected: 'The inspection result was rejected; please review the reasons below:',
		seeRequest: 'See request',
		seeInspection: 'See inspection',
		cancelSuccess: 'The inspection request was successfully canceled.',
		cancelReason: 'Reason for cancellation',
		cancelModal: {
			title: 'Are you sure you want to cancel the inspection scheduling request?',
			subtitle: 'If you cancel the request, you can perform it again by searching for the style in “Pending Orders”.'
		}
	},
	setup_inspection: {
		title: 'Inspection Scheduling Preparation',
		description: 'Review selected styles and configure the inspection. You can also add or remove styles at this stage.',
		warning_title: 'You are preparing an inspection scheduling request.',
		warning_description:
			'The inspection will be considered confirmed only when the status in the schedule is "Schedule Confirmed", which you can verify in the Inspections tab.',
		inspection_schedule_label:
			'Select the inspection type, factory, and the desired date. If the factory does not appear in the dropdown list, you can add it manually using the “Add New Factory” button.',
		add_factory: 'Add New Factory',
		address: 'Address',
		inputs: {
			type_of_inspection: {
				label: 'Inspection Type',
				placeholder: 'Select inspection type'
			},
			factory: {
				label: 'Factory',
				placeholder: 'Select factory'
			},
			date: {
				placeholder: 'Select inspection date'
			}
		}
	},
	summary_scheduling: {
		title: 'Inspection Scheduling Summary',
		description: 'Review the summary of your inspection scheduling requests.',
		warning_title: 'This is an inspection scheduling request.',
		warning_description:
			'The inspection will be considered confirmed once the status in the agenda is "Schedule Confirmed", which you can check in the Inspections tab.',
		request_summary_title: 'Scheduling request summary',
		items: {
			styles: 'Styles selected for inspection',
			styles_selected: 'Styles selected for inspection',
			purchaseOrders: 'Purchase orders included',
			skus: 'Total SKUs',
			skus_selected: 'SKUs selected for inspection',
			total_skus: 'Total SKUs',
			inspectionType: 'Inspection type'
		},
		inspection_type_value: 'Final inspection',
		submission_summary_title: 'Request summary',
		download_excel: 'Download Excel',
		notify_question: 'Do you want us to notify you at {{email}}?',
		add_email: 'Add another email',
		back_to_schedule: 'Back to schedule'
	},
	inspections_mgmt: {
		title: 'Inspection Management',
		description: 'In this section, the inspector can review their assigned inspections, record the corresponding results, and check the history of inspections already carried out.',
		company: 'Company',
		vendor: 'Vendor',
		selfInspection: 'Self Inspection',
		inspectionID: 'Inspection ID',
		inspectionCode: 'Inspection Code',
		code: 'Code',
		form: 'Inspection form',
		detail: 'Inspection detail',
		result: 'Inspection result',
		poTotal: 'Total PO',
		requestedDate: 'Requested inspection date',
		startInspection: 'Start inspection',
		reviewInspection: 'Review inspection',
		viewInspection: 'View inspection',
		editInspection: 'Edit inspection',
		subtitle: 'Images and inspection results',
		recommendations: 'Recommendations',
		editComment: 'Edit comment',
		describeRecommendation: 'When uploading images, ensure they are in JPG or PNG format, do not exceed 5MB, and are clear and relevant. You may include photos of packaging, workmanship, and measurements. Avoid blurry images or personal information, and use descriptive filenames if possible.',
		formStep: {
			title: 'Inspection form',
			stepDesc: 'Complete the form and upload it',
			description: 'Here, the inspector can download the standard form required to record inspections. After filling it out with the necessary data, they must upload it back to the platform so the inspections are properly registered in the system.',
			downloadLabel: '1. Download the form',
			downloadDesc: 'Download and complete the inspection form, making sure to follow the required format.',
			downloadBtn: 'Download inspection form',
			uploadLabel: '2. Upload the form',
			uploadDesc: 'Once you have completed the inspection form, attach it by dragging it or selecting it with the file browser.',
			fileUploadLabel: 'Drag & drop the modified File here, or click to select',
			fileUploadDesc: 'Supported formats: CSV, XLS, XLSX, PDF. Maximum size: 4mb.'
		},
		imageStep: {
			title: 'Image Upload',
			stepDesc: 'Upload the inspection photos',
			recommendations: 'Recommendations',
			recomDesc: 'When uploading images, make sure they are in JPG or PNG format, do not exceed 5 MB, and are clear and relevant. You may include photos of packaging, workmanship quality, and measurements taken. Avoid blurry images or those containing personal information, and use descriptive file names whenever possible.',
			packaging: 'Packaging',
			workmanship: 'Workmanship',
			measurements: 'Measurements',
			fileUploadLabel: 'Drag & drop the files here, or click to select',
			fileUploadDesc: 'Supported formats: JPG, PNG. Maximum size: 4mb.',
			saveImages: 'Save images'
		},
		resolutionStep: {
			title: 'Resolution',
			stepDesc: 'Set the inspection result',
			description: 'At this stage you must assign the corresponding result to the inspection: approved, rejected, partially approved, or on hold. In addition, you can enter comments to support your decision, provide relevant observations, or indicate required actions.',
			resultLabel: 'Inspection result',
			commentsLabel: 'Comments'
		},
		commentModal: {
			title: 'Resolution comments',
			desc: 'Add comments to justify and/or supplement the SKU inspection resolution.',
			comments: 'Comments'
		}
	},
	my_schedule_request: {
		title: 'Schedule Approval',
		description: 'Review scheduling requests and confirm their approval or rejection.',
		approve_request: 'Approve Request',
		reject_request: 'Reject Request',
		schedule_stage: 'Schedule Status',
		rejected_success: 'Rejected Schedule',
		table: {
			vendorName: 'Vendor',
			facilityName: 'Facility',
			id: 'Inspection ID',
			styleSku: 'Style/SKU',
			scheduleDate: 'Inspection Date',
			typeName: 'Inspection Type',
			inspector: 'Inspector',
			estadoAgenda: 'Schedule Status',
			ver: 'View'
		},
		modal: {
			rejectTitle: 'Inspection Request Rejection',
			rejectDescription: 'Select the reason for rejecting the inspection scheduling request.',
			rejectTypeLabel: 'Rejection Reason',
			rejectCommentsLabel: 'Comments',
			rejectButton: 'Save',
			cancelButton: 'Back'
		}
	},
	approved_schedule_request: {
		selfInspection: 'Self-inspection',
		approvedScheduleRequest: 'Approve scheduling',
		noInspector: 'The selected facility has no available inspectors',
		modalDesc: 'Upon confirmation, the vendor will be able to perform the inspection themselves.',
		inputs: {
			noInspector: '0 Inspectors found.',
			inspection_date: {
				label: 'Proposed inspection date',
				placeHolder: 'Select date'
			},
			inspection_level: {
				label: 'Configure inspection parameters',
				placeHolder: 'Inspection level'
			},
			lower_level: {
				placeHolder: 'Minimum level'
			},
			higher_level: {
				placeHolder: 'Maximum level'
			},
			inspector: {
				label: 'Inspector',
				placeHolder: 'Select inspector'
			},
			facility: {
				placeHolder: 'Select facility'
			}
		}
	}
};
