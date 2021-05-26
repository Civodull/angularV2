import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable,Subject,combineLatest } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { CreateUsersComponent } from '../create-users/create-users.component'; 

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {
  creatUser:FormGroup;
  users:any[] = [];
  firestore: any;
  archive: Observable<any[]>;
  id: string | null;
  Loading=false;
  constructor(
    private fb:FormBuilder,
 firestore: AngularFirestore,
 private aRouter:ActivatedRoute,
 private router:Router,
    private _userService:UsersService,
    private toastr: ToastrService) {
  this.archive = firestore.collection('archive').valueChanges();
  this.creatUser = this.fb.group({
    nom:['', [Validators.required,Validators.minLength(2)]],
    prenom:['', [Validators.required,Validators.minLength(2)]],
    pseudo:['', [Validators.required,Validators.minLength(2)]],
    adresse:['', [Validators.required,Validators.maxLength(40)]],
    email:['', [Validators.required, Validators.email]],
    telephone:['', [Validators.required,Validators.maxLength(15)]],
   // password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
    role:['', Validators.required]
    
//    role:['', Validators.required]
  });
//Recuperation de l'utilisateur à modifier
this.id = this.aRouter.snapshot.paramMap.get('id');
 }

  ngOnInit(): void {
    this.getUserDoc()
 //   Observable.combineLatest(this.startObs, this.endObs).subscibe((value:any) => {//
 //     this.firequery(value[0], value[1]).subscribe((clubs:any) =>this.clubs=clubs);
  //  });
  }
//Cette fonction interagit avec le service pour la recuperation du user
  getUserDoc(){
    this._userService.getUser().subscribe(data => {
      this.users = [];
      data.forEach((el:any) => {
      //  console.log(el.payload.doc.id);
        //console.log(el.payload.doc.data());
        this.users.push({
          id:el.payload.doc.id,
          ...el.payload.doc.data()
        })
      }); console.log(this.users);
    })
  }
  //Methode d'insersion 
  inserEdit() {
    
    const unUser:any={
      nom:this.creatUser.value.nom,
      prenom:this.creatUser.value.prenom,
      pseudo:this.creatUser.value.pseudo,
      adresse:this.creatUser.value.adresse,
      email:this.creatUser.value.email,
      telephone:this.creatUser.value.telephone,
      role:this.creatUser.value.role,
      datedeCreation:new Date(), 
      dateModification:new Date()
    }
        this.Loading = true;
        this._userService.ajouterUser(unUser).then(()=>{
        this.toastr.success('Utilisateur modifier avec succès','Excellent!',{
          positionClass:'toast-top-right',
        });
        this.Loading = true;
        this.router.navigate(['/admin'])
      }).catch(err =>{
        console.log(err);
        this.Loading = false;
      })
      }
//Suppression cote front 
deleteUser(id:string,unUser:any){
//definir dabord l'enregistremement

//fin
  this._userService.deleteUser(id).then(() => {
 //   console.log('Utilisateur supprimer avec succes!');
  this.firestore.collection('archive').add(inserEdit());
  this.toastr.error('Utilisateur supprimer avec succès','Vérifiez l archive!',{
    positionClass:'toast-bottom-right',
  });
  }).catch(err => {
    console.log(err)
  })
}
//bar de recherche 

//recuperation de l'utilisateur supprimer
}
function inserEdit(): any {
  throw new Error('Function not implemented.');
}

