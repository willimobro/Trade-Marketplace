//
//  Server Control.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI
import FirebaseDatabase
import FirebaseDatabaseSwift

class WriteViewModel: ObservableObject  {
    private let ref = Database.database().reference()
    func pushNewValue(value: String){
        ref.setValue(value)
    }
}
