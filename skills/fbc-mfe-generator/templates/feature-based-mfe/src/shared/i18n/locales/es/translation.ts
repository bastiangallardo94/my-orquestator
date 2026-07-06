export default {
	pages: {
		inspectionScheduling: 'Agendamiento de inspecciones',
		scheduleApproval: 'Aprobación de agendamientos',
		inspectionSchedulingPreparation: 'Preparación para el agendamiento de inspecciones'
	},
	common: {
		images: 'Imágenes',
		required: 'Requerido',
		continue: 'Continuar',
		status: 'Estado',
		refuse: 'Rechazar',
		accept: 'Aceptar',
		result: 'Resultado',
		comment: 'Comentario',
		manageImages: 'Gestionar imágenes',
		loading: 'Cargando...',
		saving: 'Guardando...',
		error: 'Error',
		success: 'Éxito',
		save: 'Guardar',
		cancel: 'Cancelar',
		delete: 'Eliminar',
		edit: 'Editar',
		add: 'Agregar',
		search: 'Buscar',
		filter: 'Filtrar',
		export: 'Exportar',
		import: 'Importar',
		close: 'Cerrar',
		open: 'Abrir',
		confirm: 'Confirmar',
		reset: 'Limpiar',
		yes: 'Sí',
		no: 'No',
		back: 'Volver',
		next: 'Siguiente',
		previous: 'Anterior',
		reload: 'Recargar',
		notAvailable: 'No disponible',
		accessDenied: 'Acceso Denegado',
		accessDeniedMessage:
			'No tienes los permisos necesarios para acceder a esta página.',
		requiredRoles: 'Roles requeridos:',
		goBack: 'Volver',
		goHome: 'Ir al Inicio',
		accessDeniedHelp:
			'Si crees que esto es un error, contacta con el administrador del sistema.',
		developedBy: 'Desarrollado por el equipo Imports',
		noData: 'Use los filtros para mostrar data.',
		errorLoading: 'Se produjo un error cargando los datos.',
		noDataFound: 'No se encontró data.',
		found: 'encontrados',
		description: 'Descripción',
		home: 'Inicio',
		style: 'Estilo',
		sku: 'SKU',
		inspection: 'Inspección',
		purchaseOrder: 'Órden de Compra',
		download: 'Descargar',
		noFilesUploaded: 'No hay archivos cargados.'
	},
	errors: {
		generic: 'Ha ocurrido un error',
		network: 'Error de conexión',
		unauthorized: 'No autorizado',
		forbidden: 'Acceso denegado',
		notFound: 'No encontrado',
		serverError: 'Error del servidor',
		validation: 'Error de validación',
		required: 'Este campo es requerido',
		invalidFormat: 'Formato inválido'
	},
	auth: {
		login: 'Iniciar sesión',
		logout: 'Cerrar sesión',
		accessDenied: 'Acceso denegado',
		noPermissions: 'No tienes permisos para acceder a esta página',
		sessionExpired: 'Tu sesión ha expirado',
		admin: 'Administrador',
		user: 'Usuario'
	},
	menu: {
		home: 'Inicio',
		example: 'Ejemplo',
		about: 'Acerca de'
	},
	portal: {
		tenant: 'Tenant',
		businessUnit: 'Unidad de Negocio',
		country: 'País',
		language: 'Idioma',
		notSelected: 'No seleccionado',
		ready: 'Listo',
		waiting: 'Esperando...'
	},
	menuData: {
		template: 'Template',
		home: 'Inicio',
		example: 'Ejemplo',
		about: 'Acerca de',
		admin: 'Administrador'
	},
	home: {
		title: 'Inspecciones',
		description:
			'Este módulo permite agendar, modificar y confirmar sus citas de inspección de forma autónoma. Mejora la coordinación y reduce tiempos de espera con una experiencia simple y eficiente.',
		scheduling: {
			title: 'Agendamiento de Inspecciones',
			description:
				'Revisa las órdenes de compra y estilos listos para gestionar.'
		},
		results: {
			title: 'Resultado de Inspección',
			description: 'Revisa los resultados de las inspecciones.'
		},
		inspector: {
			title: 'Mis inspecciones (inspector)',
			description: 'Revisa las inspecciones que tienes asignadas para ejecutar, así como el historial de las ya realizadas.'
		},
		schedule_approval: {
			title: 'Mis solicitudes de inspección',
			description: 'Revisa las solicitudes de agendamiento de inspección y gestiona su aprobación o rechazo.'
		},
		inspection_management: {
			title: 'Gestión de excepciones',
			description: 'Revisa y gestiona las inspecciones agrupadas por orden de compra.'
		}
	},
	inspection_management: {
		title: 'Gestión de excepciones',
		description: 'Revisa y gestiona las inspecciones agrupadas por orden de compra.',
		table_placeholder: 'Tabla de OC/Detalles — pendiente definición con FSS-5297',
		exceptions_button: 'Excepciones de Inspección',
		reason_label: 'Razón',
		reason_required_blacklist: 'requerido para Blacklist',
		reason_placeholder: 'Ingresa la razón de la excepción',
		blacklist_button: 'Forzar Inspección (Blacklist)',
		whitelist_button: 'Liberar Inspección (Whitelist)',
		see_details: 'Ver detalles',
		items_selected: 'ítem(s) seleccionado(s)',
		table: {
			po: 'OC',
			folder: 'Carpeta',
			bu: 'BU',
			country: 'País',
			vendor: 'Vendor Corp',
			col: 'COL',
			crd: 'CRD'
		},
		summary: {
			title_ok: 'Proceso completado exitosamente',
			title_error: 'Se encontraron errores en el proceso',
			processed: 'Procesados',
			errors: 'Errores',
			tab_ok: 'Procesados OK',
			tab_error: 'Errores',
			finish_button: 'Finalizar',
			no_items: 'Sin ítems para mostrar',
			breadcrumb: 'Resumen',
			col_oc: 'Orden de Compra',
			col_inspection: 'Tipo de Inspección',
			col_action: 'Acción',
			col_sku_style: 'SKU/Style',
			col_description: 'Descripción',
			col_folder: 'Carpeta',
			col_reason: 'Razón',
			col_error_reason: 'Resultado',
			col_detail: 'Detalle',
			col_inspection_type: 'Tipo Inspección',
			col_state: 'Estado actualizado',
			col_error: 'Motivo error',
			download_msg: 'Descarga el resumen de errores para corregir y recargar',
			download_button: 'Download Summary',
			file_max_error: 'Solo se permite un archivo',
			file_extension_error: 'Formato no permitido. Use CSV, XLS o XLSX',
			file_size_error: 'El archivo supera el máximo de 10MB',
			upload_label: 'Arrastra el archivo corregido aquí, o haz click para seleccionar',
			upload_desc: 'Formatos soportados: CSV, XLS, XLSX. Máximo 10MB.'
		},
		bulk: {
			breadcrumb: 'Excepción Masiva',
			title: 'Selección masiva de órdenes de compra',
			description: 'Para realizar una selección masiva de OC, carga una plantilla Excel con una lista de las órdenes de compra que quieres incluir en la cita.',
			upload_label: 'Arrastra el archivo aquí, o haz clic para explorar',
			upload_desc: 'Formatos soportados: CSV, XLS, XLSX. Peso máximo: 10mb.'
		}
	},
	card: {
		template: 'Pre-shipment Inspections'
	},
	scheduling: {
		title: 'Agendamiento de Inspecciones',
		navigation: 'Navegación Agendamiento de Inspecciones',
		description:
			'Este módulo permite solicitar el agendamiento de inspecciones, hacer seguimiento al estado de cada solicitud y consultar los resultados de las inspecciones realizadas.',
		purchaseOrders: 'Órdenes de Compra',
		pendingOrders: 'Órdenes Pendientes',
		scheduledInspections: 'Inspecciones Agendadas',
		bu: 'Unidad de Negocio',
		vendor: 'Proveedor',
		destCountry: 'País de Destino',
		country: 'País',
		poNumber: 'Órden de Compra',
		folderNumber: 'Carpeta',
		status: 'Estado',
		proformaInvoice: 'Proforma Invoice',
		crd: 'Cargo Ready Date',
		stage: 'Estado',
		poStage: 'Estado Órden de Compra',
		inspectionStatus: 'Estado de Inspección',
		style: 'Estilo',
		styles: 'Ver estilos',
		skus: 'Ver SKUs',
		purchaseOrdersPage: {
			found: 'Órdenes de compra encontradas'
		},
		inspectionCode: 'Inspection Code',
		inspectionTypes: 'Tipos Inspección',
		inspectionType: 'Tipo Inspección',
		inspectionDay: 'Día Inspección',
		stageStatus: 'Estado agenda',
		inspector: 'Inspector',
		inspectorID: 'ID Inspector',
		inspectorCompany: 'Compañía Inspector'
	},
	inspection: {
		summary: 'Resumen de la solicitud de inspección',
		breadcrumbReq: 'Solicitud de inspección',
		breadcrumbRes: 'Resultado de inspección',
		selectedOrders: 'Órdenes seleccionadas',
		date: 'Fecha solicitada de inspección',
		facility: 'Fábrica',
		address: 'Dirección',
		prepSummary: 'Resumen de la preparación',
		notify: '¿Quieres que te notifiquemos al correo',
		returnToSchedule: 'Volver a la agenda',
		returnToInspections: 'Volver a inspecciones',
		cancelRequest: 'Cancelar solicitud',
		downloadSummary: 'Descargar resumen',
		editRequest: 'Editar solicitud',
		titlePart1: 'La solicitud de inspección',
		titleConfirmed: 'La inspección fue aprobada',
		titleApproved: 'Inspección aprobada',
		titleRejected: 'Inspección rechazada',
		titleProcessing: 'La inspección está en revisión',
		titlePartiallyApproved: 'Inspección parcialmente aprobada',
		titleRequestConfirmed: 'La solicitud de inspección está confirmada',
		titleRequestUnderReview: 'La solicitud de inspección está en revisión',
		titleRequestRejected: 'La solicitud de inspección fue rechazada',
		result: 'Resultado de inspección',
		type: 'Tipo de inspección',
		addToCalendar: 'Agregar al calendario',
		excel: 'Descargar Excel',
		addEmail: 'Agregar otro correo',
		modal: {
			title:
				'¿Estás seguro que quieres cancelar la solicitud de agendamiento de inspección?',
			description:
				'Si cancelas la solicitud, puedes volver a realizarla buscando el estilo en “Órdenes pendientes”.',
			reason: 'Motivo de la cancelación (opcional)',
			confirm: 'Confirmar cancelación'
		},
		found: 'inspecciones encontradas',
		obs: 'Observaciones',
		rejectDescription: 'Revisa el motivo del rechazo, corrígelo y solicita nuevamente el agendamiento',
		obsApproved:
			'Tu inspección fue aprobada, pero es recomendable revisar los siguientes puntos:',
		obsRejected:
			'El resultado de la inspección fue rechazada, revisa los motivos a continuación:',
		seeRequest: 'Ver solicitud',
		seeInspection: 'Ver inspección',
		cancelSuccess: 'La solicitud de inspección fue cancelada correctamente.',
		cancelReason: 'Motivo de la cancelación',
		cancelModal: {
			title: '¿Estás seguro que quieres cancelar la solicitud de agendamiento de inspección?',
			subtitle: 'Si cancelas la solicitud, puedes volver a realizarla buscando el estilo en “Órdenes pendientes”.'
		}
	},
	setup_inspection: {
		title: 'Preparación para el agendamiento de inspecciones',
		description:
			'Revisa los estilos seleccionados y configura la inspección. Puedes también agregar o quitar estilo en esta etapa.',
		warning_title: 'Estás preparando una solicitud de agenda de inspección.',
		warning_description:
			'La inspección se considerará confirmada solo cuando el estado en la agenda sea "Agendamiento confirmado", lo cual puedes verificar en la pestaña Inspecciones.',
		inspection_schedule_label:
			'Selecciona el tipo de inspección, la fábrica y la fecha en que quieres sea realizada. Si la fábrica no aparece en la lista desplegable, puedes agregarla manualmente utilizando el botón “Agregar nueva fábrica”.',
		add_factory: 'Agregar nueva fábrica',
		address: 'Dirección',
		inputs: {
			type_of_inspection: {
				label: 'Tipo de inspección',
				placeholder: 'Selecciona tipo de inspección'
			},
			factory: {
				label: 'Fábrica',
				placeholder: 'Selecciona fábrica'
			},
			date: {
				placeholder: 'Selecciona fecha de inspección'
			}
		}
	},
	summary_scheduling: {
		title: 'Resumen de agendamiento de inspección',
		description: 'Revisa el resumen de tus solicitudes de agendamiento.',
		warning_title: 'Esta es una solicitud de agenda de inspección.',
		warning_description:
			'La inspección se considerará confirmada solo cuando el estado en la agenda sea "Agendamiento confirmado", lo cual puedes verificar en la pestaña Inspecciones.',
		request_summary_title: 'Resumen de la solicitud de agendamiento',
		items: {
			styles: 'Estilos seleccionados para inspección',
			styles_selected: 'Estilos seleccionados para inspección',
			purchaseOrders: 'Órdenes de compra incluidas',
			skus: 'Total de SKUs',
			skus_selected: 'SKUs seleccionados para inspección',
			total_skus: 'Total de SKUs',
			inspectionType: 'Tipo de inspección'
		},
		inspection_type_value: 'Inspección final',
		submission_summary_title: 'Resumen de la solicitud',
		download_excel: 'Descargar Excel',
		notify_question: '¿Quieres que te notifiquemos al correo {{email}}?',
		add_email: 'Agregar otro correo',
		back_to_schedule: 'Volver a la agenda'
	},
	inspections_mgmt: {
		title: 'Gestión de inspecciones',
		description: 'En esta sección, el inspector puede consultar sus inspecciones asignadas, registrar los resultados correspondientes y revisar el historial de inspecciones ya realizadas.',
		company: 'Empresa',
		vendor: 'Proveedor',
		selfInspection: 'Auto inspección',
		inspectionID: 'ID Inspección',
		inspectionCode: 'Código Inspección',
		code: 'Código',
		form: 'Planilla de inspección',
		formDescription: '',
		detail: 'Detalle inspección',
		result: 'Resultado inspección',
		poTotal: 'Total OC',
		requestedDate: 'Fecha inspección solicitada',
		startInspection: 'Iniciar inspección',
		reviewInspection: 'Revisar inspección',
		viewInspection: 'Ver inspección',
		editInspection: 'Editar inspección',
		subtitle: 'Imágenes y resultado de inspección',
		recommendations: 'Recomendaciones',
		editComment: 'Editar comentario',
		describeRecommendation: 'Al cargar imágenes, asegúrate de que estén en formato JPG o PNG, no superen los 5MB y sean claras y relevantes. Puedes incluir fotos de packaging, calidad del trabajo (workmanship) y medidas tomadas. Evita imágenes borrosas o con información personal, y usa nombres descriptivos si es posible.',
		formStep: {
			title: 'Planilla de inspección',
			stepDesc: 'Completa la planilla y cárgala',
			description: 'En esta sección, el inspector puede descargar la planilla base con el formato requerido para registrar inspecciones. Una vez completada con los datos correspondientes, debe subirla nuevamente a la plataforma para que las inspecciones queden registradas en el sistema.',
			downloadLabel: '1. Descarga template de inspección',
			downloadDesc: 'Descarga el template para completar la inspección.',
			downloadBtn: 'Descargar template de inspección',
			uploadLabel: '2. Carga el reporte de inspección',
			uploadDesc: 'Una vez que hayas completado la inspección, carga el reporte final arrastrándolo a esta zona o buscándolo en tu explorador de archivos.',
			fileUploadLabel: 'Arrastra el archivo modificado aquí o busca desde tu computador',
			fileUploadDesc: 'Formatos soportados: CSV, XLS, XLSX, PDF. Tamaño máximo: 4mb.'
		},
		imageStep: {
			title: 'Carga de imágenes y resolución',
			stepDesc: 'Sube las fotos de la inspección',
			recommendations: 'Recomendaciones',
			recomDesc: 'Al cargar imágenes, asegúrate de que estén en formato JPG o PNG, no superen los 5 MB y sean claras y relevantes. Puedes incluir fotos de packaging, calidad del trabajo (workmanship) y medidas tomadas. Evita imágenes borrosas o con información personal, y usa nombres descriptivos si es posible.',
			packaging: 'Packaging',
			workmanship: 'Workmanship',
			measurements: 'Measurements',
			fileUploadLabel: 'Arrastra los archivos aquí o busca desde tu computador',
			fileUploadDesc: 'Formatos soportados: JPG, PNG. Tamaño máximo: 4mb.',
			saveImages: 'Guardar imágenes'
		},
		resolutionStep: {
			title: 'Resolución',
			stepDesc: 'Asigna el resultado de la inspección',
			description: 'En esta etapa debes asignar el resultado correspondiente a la inspección: aprobada, rechazada, aprobada parcialmente o en espera (on hold). Además, puedes ingresar comentarios que respalden tu decisión, detallen observaciones relevantes o indiquen acciones requeridas.',
			resultLabel: 'Resultado inspección',
			commentsLabel: 'Comentarios'
		},
		commentModal: {
			title: 'Comentarios para la resolución',
			desc: 'Agrega comentarios para justificar y/o complementar la resolución de la inspección del SKU.',
			comments: 'Comentarios'
		}
	},
	my_schedule_request: {
		title: 'Aprobación de Agendamientos',
		description: 'Revisa las solicitudes de agendamiento y confirma su aprobación o rechazo.',
		approve_request: 'Aprobar Solicitud',
		reject_request: 'Rechazar Solicitud',
		schedule_stage: 'Estado de agenda',
		rejected_success: 'Agenda rechazada',
		table: {
			vendorName: 'Proveedor',
			facilityName: 'Empresa',
			id: 'ID Inspección',
			styleSku: 'Estilo/Sku',
			scheduleDate: 'Día inspección',
			typeName: 'Tipo Inspección',
			inspector: 'Inspector',
			estadoAgenda: 'Estado agenda',
			ver: 'Ver'
		},
		modal: {
			rejectTitle: 'Rechazo de solicitud de inspección',
			rejectDescription: 'Selecciona el motive del rechazo de la solicitud de agendamiento de inspección.',
			rejectTypeLabel: 'Motivo del rechazo',
			rejectCommentsLabel: 'Comentarios',
			rejectButton: 'Guardar',
			cancelButton: 'Volver'
		}
	},
	approved_schedule_request: {
		selfInspection: 'Inspección propia',
		approvedScheduleRequest: 'Aprobar agendamiento',
		noInspector: 'La empresa seleccionada no tiene inspectores disponibles',
		modalDesc: 'Al confirmar, el proveedor podrá realizar la inspección por sí mismo.',
		inputs: {
			noInspector: '0 Inspectores encontrados.',
			inspection_date: {
				label: 'Fecha propuesta para inspección',
				placeHolder: 'Selecciona fecha'
			},
			inspection_level: {
				label: 'Configura parámetros de inspección',
				placeHolder: 'Nivel de inspección'
			},
			lower_level: {
				placeHolder: 'Nivel mínimo'
			},
			higher_level: {
				placeHolder: 'Nivel máximo'
			},
			inspector: {
				label: 'Inspector',
				placeHolder: 'Selecciona el inspector'
			},
			facility: {
				placeHolder: 'Selecciona la empresa'
			}
		}
	}
};
