<?php
/*
 *  Copyright 2022.  Baks.dev <admin@baks.dev>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */

namespace Pages\Controller\User\Comments;

use BaksDev\Core\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class NewController extends AbstractController
{
    #[Route('/reviews/new', name: 'user.reviews.newedit.new')]
    public function index(Request $request) : Response
    {
        
        // $mod = new ModifyAction('update');
        //        $mod = ModifyAction::UPDATE;
        //        dump($mod->value);
        //
        //
        //        $mod = ModifyAction::from($mod->value);
        //        dump($mod);
        
        return $this->render([]);
        
        //        return $this->render('home/index.html.twig', [
        //            'controller_name' => 'HomeController',
        //        ]);
    }

    
}
