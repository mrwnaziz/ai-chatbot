type DataType = 'programs' | 'events' | 'insights';

export function filterAndFormatData(data: any[], query: string, type: DataType): any[] {
  const keywords = query.toLowerCase().split(' ');
  const currentDate = new Date();

  return data.filter(item => {
    if (type === 'programs' || type === 'events') {
      const startDate = new Date(item.Start_Date);
      const endDate = new Date(item.Application_End_Date || item.End_Date);
      return startDate >= currentDate || endDate >= currentDate;
    }
    return true;
  }).filter(item => 
    keywords.some(keyword => 
      JSON.stringify(item).toLowerCase().includes(keyword)
    )
  ).map(item => {
    let formattedItem: any = {
      title_en: item.Title_En,
      title_ar: item.Title_Ar,
      description_en: item.Description_En,
      description_ar: item.Description_Ar,
      item_Url: item.Item_URL ? item.Item_URL.replace('http://', 'https://') : '',
      start_date: item.Start_Date,
      end_date: item.End_Date,
      categories_en: item.Categories_En,
      categories_ar: item.Categories_Ar,
    };

    if (type === 'programs') {
      formattedItem = {
        ...formattedItem,
        application_start_date: item.Application_Start_Date,
        application_end_date: item.Application_End_Date,
        format: item.Format,
        languages: item.Languages,
        skills_en: item.Skills_En,
        skills_ar: item.Skills_Ar,
        prerequisites_en: item.Course_Prerequisties_En,
        prerequisites_ar: item.Course_Prerequisties_Ar,
        about_program_en: item.About_Program_En,
        about_program_ar: item.About_Program_Ar,
        program_modules_en: item.Program_Modules_En,
        program_modules_ar: item.Program_Modules_Ar,
        program_highlights_en: item.Program_Highlights_En,
        program_highlights_ar: item.Program_Highlights_Ar,
      };
    } else if (type === 'events') {
      formattedItem = {
        ...formattedItem,
        start_time: item.Start_Time,
        end_time: item.End_Time,
        event_type: item.Event_Type,
        types: item.Types,
        cities_en: item.Cities_En,
        cities_ar: item.Cities_Ar,
        locations_en: item.Locations_En,
        locations_ar: item.Locations_Ar,
        venue_en: item.Venue_En,
        venue_ar: item.Venue_Ar,
        registration_start_date_time_en: item.Registration_Start_Date_Time_En,
        registration_start_date_time_ar: item.Registration_Start_Date_Time_Ar,
        registration_end_date_time_en: item.Registration_End_Date_Time_En,
        registration_end_date_time_ar: item.Registration_End_Date_Time_Ar,
        event_description_en: item.Event_Description_En,
        event_description_ar: item.Event_Description_Ar,
        event_agenda_items_en: item.Event_Agenda_Items_En,
        event_agenda_items_ar: item.Event_Agenda_Items_Ar,
        faqs_en: item.FAQs_En,
        faqs_ar: item.FAQs_Ar,
        notable_speakers: item.Notable_Speakers,
      };
    } else if (type === 'insights') {
      formattedItem = {
        ...formattedItem,
        publication_date: item.Publication_Date,
        author: item.Author,
        content_en: item.Content_En,
        content_ar: item.Content_Ar,
        tags_en: item.Tags_En,
        tags_ar: item.Tags_Ar,
      };
    }

    return formattedItem;
  });
}