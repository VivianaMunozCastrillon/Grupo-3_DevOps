const { EntitySchema } = require("typeorm");
const Profession = require("./Profession"); // Asegúrate de importar la entidad Profession

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
    ProfessionId: {
      type: "int"
    },
    Skill: {
      type: "json"
    },
    Resume: {
      type: "varchar"
    }
  },
  relations: {
    profession: {
      type: "many-to-one", // Relación de muchos a uno
      target: "Profession", // Nombre de la entidad relacionada
      joinColumn: {
        name: "ProfessionId" // Nombre de la columna que se usará para la unión
      }
    }
  }
});

module.exports = Candidate;
