import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Usuario } from '@app/modules/usuarios/entities/usuario.entity';
import { Curso } from '@app/modules/carreras/cursos/entities/curso.entity';

@Entity('usuarios_cursos')
export class UsuarioCurso {
  @PrimaryColumn()
  id_usuario!: number;

  @PrimaryColumn()
  id_curso!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarios_cursos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ManyToOne(() => Curso, (curso) => curso.usuarios_cursos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_curso' })
  curso!: Curso;
}
