const { EntitySchema } = require("typeorm");

const Candidate = new EntitySchema({
  name: "Candidate",
  tableName: "TblCandidates",
  columns: {
    CandidatesId: {
      primary: true,
      type: "int",
      generated: false
    },
    Name: {
        type: "varchar"
      },
      Email: {
        type: "varchar"
      },
      Phone: {
      type: "varchar"
    },
    ProfessionId: {
      type: "int"
    },
    ExperienceYears: {
      type: "int"
    },
    EducationLevel: {
      type: "varchar"
    },
    ApplicationDate: {
        type: "date"
      },
      City: {
        type: "varchar" 
      },
      Skill: {
        type: "varchar" 
      },
    Resume: {
      type: "varchar" 
    },
    
  }
});

module.exports = Candidate;
